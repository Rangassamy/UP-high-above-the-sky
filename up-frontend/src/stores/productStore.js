import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_PRODUCTS } from "../data/seed";
import { makeSlug } from "../lib/slug";

function loadSeed(){
  return SEED_PRODUCTS.map(p => ({ ...p }));
}

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: loadSeed(),

      listPublic(){
        return get().products.filter(p => p.active);
      },
      getBySlug(slug){
        return get().products.find(p => p.slug === slug) || null;
      },
      getById(id){
        return get().products.find(p => p.id === id) || null;
      },
      listByCategory(category){
        return get().products.filter(p => p.active && p.category === category);
      },
      featured(){
        const pub = get().listPublic();
        return pub.find(p => p.featured) || pub[0] || null;
      },

      upsert(product){
        set((state) => {
          const incoming = { ...product };
          if (!incoming.slug) incoming.slug = makeSlug(incoming.name);
          if (!incoming.id) incoming.id = "p_" + Math.random().toString(16).slice(2, 10);

          const idx = state.products.findIndex(p => p.id === incoming.id);
          if (idx >= 0){
            const next = [...state.products];
            next[idx] = { ...next[idx], ...incoming };
            return { products: next };
          }
          return { products: [incoming, ...state.products] };
        });
      },

      remove(id){
        set((state) => ({ products: state.products.filter(p => p.id !== id) }));
      },

      toggleActive(id){
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, active: !p.active } : p)
        }));
      },

      setFeatured(id){
        set((state) => ({
          products: state.products.map(p => ({ ...p, featured: p.id === id }))
        }));
      },

      adjustStock(id, stockQty){
        const q = Math.max(0, Number(stockQty || 0));
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, stockQty: q } : p)
        }));
      },
    }),
    { name: "up_products_full" }
  )
);
