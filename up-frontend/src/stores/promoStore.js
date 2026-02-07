import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_PROMOS } from "../data/seed";
import { PromosAPI } from "../api/promos";

function seed() {
  return SEED_PROMOS.map((p) => ({ ...p, code: String(p.code).toUpperCase() }));
}

function mapPromo(p) {
  if (!p) return null;
  return {
    id: String(p.id ?? ""),
    code: String(p.code ?? "").toUpperCase(),
    type: p.type,
    value: Number(p.value ?? 0),
    // backend: enable (pas active)
    active: Boolean(p.enable ?? p.active ?? false),
  };
}

export const usePromoStore = create(
  persist(
    (set, get) => ({
      promos: seed(),
      lastValidate: null,
      validateError: "",
      loading: false,
      error: "",

      findActive(code) {
        const c = String(code || "")
          .trim()
          .toUpperCase();
        if (!c) return null;
        const p = get().promos.find((x) => x.code === c);
        if (!p || !p.active) return null;
        return p;
      },

      async validateRemote(code) {
        set({ validateError: "" });
        try {
          const res = await PromosAPI.validate(code);
          set({ lastValidate: res });
          return { ok: true, res };
        } catch (e) {
          set({ validateError: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      // Admin: charger depuis backend
      async fetchPromos() {
        set({ loading: true, error: "" });
        try {
          const raw = await PromosAPI.list();
          const list = Array.isArray(raw)
            ? raw
            : raw?.content || raw?.items || [];
          const mapped = list.map(mapPromo).filter(Boolean);
          set({ promos: mapped, loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async savePromo(promo) {
        set({ loading: true, error: "" });
        try {
          const payload = {
            code: String(promo.code || "")
              .trim()
              .toUpperCase(),
            type: promo.type,
            value: Number(promo.value || 0),
            enable: Boolean(promo.active),
          };

          if (promo.id) await PromosAPI.update(promo.id, payload);
          else await PromosAPI.create(payload);

          await get().fetchPromos();
          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async deletePromo(id) {
        set({ loading: true, error: "" });
        try {
          await PromosAPI.remove(id);
          await get().fetchPromos();
          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },
    }),
    { name: "up_promos_full" },
  ),
);
