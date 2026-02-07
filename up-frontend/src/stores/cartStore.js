import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartAPI } from "../api/cart";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, qty }
      promoCode: "",
      mode: "local", // 'local' | 'server'
      loading: false,
      error: "",

      add(productId, qty = 1) {
        const q = Math.max(1, Number(qty || 1));
        if (get().mode === "server") return get().addServer(productId, q);
        set((state) => {
          const found = state.items.find((it) => it.productId === productId);
          if (found) {
            return {
              items: state.items.map((it) =>
                it.productId === productId ? { ...it, qty: it.qty + q } : it,
              ),
            };
          }
          return { items: [...state.items, { productId, qty: q }] };
        });
      },

      setQty(productId, qty) {
        const q = Math.max(1, Number(qty || 1));
        if (get().mode === "server") return get().setQtyServer(productId, q);
        set((state) => ({
          items: state.items.map((it) =>
            it.productId === productId ? { ...it, qty: q } : it,
          ),
        }));
      },

      remove(productId) {
        if (get().mode === "server") return get().removeServer(productId);
        set((state) => ({
          items: state.items.filter((it) => it.productId !== productId),
        }));
      },

      clear() {
        if (get().mode === "server") return get().clearServer();
        set({ items: [], promoCode: "" });
      },

      setMode(mode) {
        set({ mode: mode === "server" ? "server" : "local" });
      },

      // ---- Server cart helpers (safe no-op if backend isn't ready) ----
      async syncFromServer() {
        set({ loading: true, error: "" });
        try {
          const raw = await CartAPI.list();
          const list = Array.isArray(raw)
            ? raw
            : raw?.content || raw?.items || raw?.cart || [];
          const items = list
            .map((it) => ({
              productId: String(
                it.productId ?? it.product_id ?? it.id ?? it.product ?? "",
              ),
              qty: Number(it.qty ?? it.quantity ?? 1),
            }))
            .filter((it) => it.productId);
          set({ items, loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async addServer(productId, qty) {
        set({ loading: true, error: "" });
        try {
          const pid = Number(productId);
          if (!Number.isFinite(pid)) {
            set({
              loading: false,
              error: "ID produit invalide (pas un nombre).",
            });
            return { ok: false, error: "invalid_product_id" };
          }

          const pidStr = String(pid);

          // Optimistic UI update (visible immédiatement)
          set((state) => {
            const found = state.items.find((it) => it.productId === pidStr);
            if (found) {
              return {
                items: state.items.map((it) =>
                  it.productId === pidStr ? { ...it, qty: it.qty + qty } : it,
                ),
              };
            }
            return { items: [...state.items, { productId: pidStr, qty }] };
          });

          // Server write
          await CartAPI.add(pid, qty);

          // Authoritative sync
          await get().syncFromServer();

          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async setQtyServer(productId, qty) {
        // Many simple backends use the same add endpoint for update.
        return get().addServer(productId, qty);
      },

      async removeServer(productId) {
        set({ loading: true, error: "" });
        try {
          const pid = Number(productId);
          if (!Number.isFinite(pid)) {
            set({
              loading: false,
              error: "ID produit invalide (pas un nombre).",
            });
            return { ok: false, error: "invalid_product_id" };
          }

          const pidStr = String(pid);

          // Optimistic remove
          set((state) => ({
            items: state.items.filter((it) => it.productId !== pidStr),
          }));

          await CartAPI.remove(pid);
          await get().syncFromServer();

          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async clearServer() {
        set({ loading: true, error: "" });
        try {
          await CartAPI.clear();
          set({ items: [], promoCode: "", loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      setPromoCode(code) {
        set({
          promoCode: String(code || "")
            .trim()
            .toUpperCase(),
        });
      },

      itemCount() {
        return get().items.reduce((s, it) => s + it.qty, 0);
      },
    }),
    { name: "up_cart_full" },
  ),
);
