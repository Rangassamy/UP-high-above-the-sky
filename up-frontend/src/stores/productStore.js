import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeSlug } from "../lib/slug";
import { ProductsAPI } from "../api/products";

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: "",
      hydrated: false,

      async fetchProducts() {
        set({ loading: true, error: "" });
        try {
          const raw = await ProductsAPI.list();
          const list = Array.isArray(raw)
            ? raw
            : raw?.content || raw?.items || [];

          const mapped = list.map((p) => ({
            id: String(p.id ?? p.product_id ?? p._id ?? ""),
            name: p.name ?? p.title ?? "",
            slug: p.slug ?? makeSlug(p.name ?? p.title ?? ""),
            category: p.category ?? p.theme ?? "caps",
            description: p.description ?? "",
            price: Number(p.price ?? 0),
            images: Array.isArray(p.images)
              ? p.images
              : p.image
                ? [p.image]
                : [],
            stockQty: Number(p.stockQty ?? p.stock_quantity ?? p.stock ?? 0),
            featured: Boolean(p.featured ?? p.is_featured ?? false),
            active: p.active ?? p.is_active ?? true,
          }));

          set({ products: mapped, hydrated: true, loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur produits", hydrated: true });
          return { ok: false, error: e.message };
        }
      },

      async saveProduct(product) {
        set({ loading: true, error: "" });
        try {
          const payload = {
            slug: product.slug,
            name: product.name,
            category: product.category,
            price: Number(product.price || 0),
            description: product.description || "",
            image: String(product.images?.[0] || "").trim(),
            stock_quantity: Number(product.stockQty || 0),
            featured: Boolean(product.featured),
          };

          if (product.id) {
            await ProductsAPI.updateOne({ id: String(product.id), ...payload });
          } else {
            await ProductsAPI.createOne(payload);
          }

          await get().fetchProducts();
          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur produits" });
          return { ok: false, error: e.message };
        }
      },

      async deleteProduct(id) {
        set({ loading: true, error: "" });
        try {
          await ProductsAPI.remove(id);
          await get().fetchProducts();
          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur produits" });
          return { ok: false, error: e.message };
        }
      },

      listPublic() {
        return get().products.filter((p) => p.active !== false);
      },
      getBySlug(slug) {
        return get().products.find((p) => p.slug === slug) || null;
      },
      getById(id) {
        return get().products.find((p) => p.id === id) || null;
      },
      listByCategory(category) {
        return get().products.filter(
          (p) => p.active !== false && p.category === category,
        );
      },
      featured() {
        const pub = get().listPublic();
        return pub.find((p) => p.featured) || pub[0] || null;
      },

      upsert(product) {
        set((state) => {
          const incoming = { ...product };
          if (!incoming.slug) incoming.slug = makeSlug(incoming.name);
          if (!incoming.id)
            incoming.id = "p_" + Math.random().toString(16).slice(2, 10);

          const idx = state.products.findIndex((p) => p.id === incoming.id);
          if (idx >= 0) {
            const next = [...state.products];
            next[idx] = { ...next[idx], ...incoming };
            return { products: next };
          }
          return { products: [incoming, ...state.products] };
        });
      },

      remove(id) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      toggleActive(id) {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, active: !p.active } : p,
          ),
        }));
      },

      setFeatured(id) {
        set((state) => ({
          products: state.products.map((p) => ({
            ...p,
            featured: p.id === id,
          })),
        }));
      },

      adjustStock(id, stockQty) {
        const q = Math.max(0, Number(stockQty || 0));
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stockQty: q } : p,
          ),
        }));
      },
    }),
    { name: "up_products_full_v2" },
  ),
);
