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
  };
}

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      error: "",

      async createOrder({ promoId } = {}) {
        set({ loading: true, error: "" });
        try {
          const res = await OrdersAPI.buy(promoId);
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

      adminList() {
        return get().orders;
      },
    }),
    { name: "up_orders_full" },
  ),
);
