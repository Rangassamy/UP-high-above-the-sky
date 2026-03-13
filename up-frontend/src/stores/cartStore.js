import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartAPI } from "../api/cart";
import { getToken } from "../api/http";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, qty }
      promoCode: "",
      loading: false,
      error: "",

      add(productId, qty = 1) {
        const q = Math.max(1, Number(qty || 1));
        return get().addServer(productId, q);
      },

      setQty(productId, qty) {
        const q = Math.max(1, Number(qty || 1));
        return get().setQtyServer(productId, q);
      },

      remove(productId) {
        return get().removeServer(productId);
      },

      clear() {
        return get().clearServer();
      },

      // ---- Server cart helpers (safe no-op if backend isn't ready) ----
      async syncFromServer() {
        if (!getToken()) {
          set({ error: "Connexion requise pour le panier" });
          return { ok: false, error: "login_required" };
        }

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
        if (!getToken()) {
          set({ error: "Connexion requise pour le panier" });
          return { ok: false, error: "login_required" };
        }

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
          const existing = get().items.find((it) => it.productId === pidStr);
          const nextQty = existing ? existing.qty + qty : qty;

          // Optimistic UI update (visible immédiatement)
          set((state) => {
            if (existing) {
              return {
                items: state.items.map((it) =>
                  it.productId === pidStr ? { ...it, qty: nextQty } : it,
                ),
              };
            }
            return { items: [...state.items, { productId: pidStr, qty: nextQty }] };
          });

          // Server write
          await CartAPI.add(pid, nextQty);

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
        if (!getToken()) {
          set({ error: "Connexion requise pour le panier" });
          return { ok: false, error: "login_required" };
        }

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
          const nextQty = Math.max(1, Number(qty || 1));

          set((state) => {
            const found = state.items.find((it) => it.productId === pidStr);
            if (found) {
              return {
                items: state.items.map((it) =>
                  it.productId === pidStr ? { ...it, qty: nextQty } : it,
                ),
              };
            }

            return { items: [...state.items, { productId: pidStr, qty: nextQty }] };
          });

          await CartAPI.add(pid, nextQty);
          await get().syncFromServer();

          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async removeServer(productId) {
        if (!getToken()) {
          set({ error: "Connexion requise pour le panier" });
          return { ok: false, error: "login_required" };
        }

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
        if (!getToken()) {
          set({ error: "Connexion requise pour le panier" });
          return { ok: false, error: "login_required" };
        }

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
    { name: "up_cart_full_v2" },
  ),
);
