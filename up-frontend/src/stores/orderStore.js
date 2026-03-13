import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrdersAPI } from "../api/orders";

function mapOrder(o) {
  if (!o) return null;
  return {
    id: String(o.id ?? ""),
    createdAt: o.created_date ?? o.createdAt ?? new Date().toISOString(),
    total: Number(o.total_price ?? o.total ?? 0),
    status: o.status ?? "EN_PREPARATION",
    email: o.email,
    name: o.name,
    address1: o.address1,
    city: o.city,
    zip: o.zip,
    promoCode: o.promo_code ?? o.promo_id,
    items: o.items,
  };
}

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      error: "",

      async createOrder({ promoId, payload } = {}) {
        set({ loading: true, error: "" });
        try {
          const res = await OrdersAPI.buy(promoId, payload);
          const order = mapOrder(res?.order || res?.content || res);
          if (order)
            set((s) => ({ orders: [order, ...s.orders], loading: false }));
          else set({ loading: false });
          return order;
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return null;
        }
      },

      async fetchMyOrders() {
        set({ loading: true, error: "" });
        try {
          const raw = await OrdersAPI.mine();
          const list = Array.isArray(raw)
            ? raw
            : raw?.content || raw?.items || [];
          const mapped = list.map(mapOrder).filter(Boolean);
          set({ orders: mapped, loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async fetchAllOrders() {
        set({ loading: true, error: "" });
        try {
          const raw = await OrdersAPI.list();
          const list = Array.isArray(raw)
            ? raw
            : raw?.content || raw?.items || [];
          const mapped = list.map(mapOrder).filter(Boolean);
          set({ orders: mapped, loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async setStatus(id, status) {
        set({ loading: true, error: "" });
        try {
          await OrdersAPI.updateStatus(id, status);
          const next = get().orders.map((o) =>
            o.id === id ? { ...o, status } : o,
          );
          set({ orders: next, loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      adminList() {
        return get().orders;
      },
    }),
    { name: "up_orders_full_v2" },
  ),
);
