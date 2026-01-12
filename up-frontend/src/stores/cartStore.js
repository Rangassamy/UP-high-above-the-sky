import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, qty }
      promoCode: "",

      add(productId, qty=1){
        const q = Math.max(1, Number(qty || 1));
        set((state) => {
          const found = state.items.find(it => it.productId === productId);
          if (found){
            return { items: state.items.map(it => it.productId === productId ? { ...it, qty: it.qty + q } : it) };
          }
          return { items: [...state.items, { productId, qty: q }] };
        });
      },

      setQty(productId, qty){
        const q = Math.max(1, Number(qty || 1));
        set((state) => ({ items: state.items.map(it => it.productId === productId ? { ...it, qty: q } : it) }));
      },

      remove(productId){
        set((state) => ({ items: state.items.filter(it => it.productId !== productId) }));
      },

      clear(){
        set({ items: [], promoCode: "" });
      },

      setPromoCode(code){
        set({ promoCode: String(code || "").trim().toUpperCase() });
      },

      itemCount(){
        return get().items.reduce((s,it)=>s+it.qty,0);
      },
    }),
    { name: "up_cart_full" }
  )
);
