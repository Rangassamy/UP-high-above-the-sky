import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      createOrder(payload){
        const id = "ORD-" + Math.random().toString(16).slice(2, 10).toUpperCase();
        const createdAt = new Date().toISOString();
        const status = "EN_PREPARATION";
        const order = { id, createdAt, status, ...payload };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },

      listForEmail(email){
        const e = String(email || "").trim().toLowerCase();
        return get().orders.filter(o => String(o.email || "").toLowerCase() === e);
      },

      adminList(){
        return get().orders;
      },

      setStatus(id, status){
        set((s) => ({ orders: s.orders.map(o => o.id === id ? { ...o, status } : o) }));
      },
    }),
    { name: "up_orders_full" }
  )
);
