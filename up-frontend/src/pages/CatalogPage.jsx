import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";

export default function CatalogPage() {
  const [sp] = useSearchParams();
  const q = String(sp.get("q") || "")
    .trim()
    .toLowerCase();

  const productsAll = useProductStore((s) => s.products); // <-- IMPORTANT: tableau brut
  const add = useCartStore((s) => s.add);

  const [filters, setFilters] = useState({
    category: "all",
    inStock: false,
    sort: "featured",
  });

  const products = useMemo(() => {
    let p = productsAll.filter((x) => x.active);

    if (q)
      p = p.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.description.toLowerCase().includes(q)
      );

    if (filters.category !== "all")
      p = p.filter((x) => x.category === filters.category);
    if (filters.inStock) p = p.filter((x) => x.stockQty > 0);

    if (filters.sort === "price_asc") p.sort((a, b) => a.price - b.price);
    if (filters.sort === "price_desc") p.sort((a, b) => b.price - a.price);
    if (filters.sort === "featured")
      p.sort((a, b) => Number(b.featured) - Number(a.featured));

    return p;
  }, [productsAll, q, filters]);

  return (
    <div className="col">
      <SectionTitle
        title="Catalogue"
        subtitle={q ? `Résultats pour “${q}”` : "Tous les produits"}
        right={
          <Link className="btn" to="/cart">
            Voir panier
          </Link>
        }
      />

      <div className="glass card">
        <div className="row wrap" style={{ alignItems: "end" }}>
          <div style={{ width: 220 }}>
            <label>Catégorie</label>
            <select
              className="input"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="all">Toutes</option>
              <option value="caps">Casquettes</option>
              <option value="vetements">Vêtements</option>
            </select>
          </div>

          <div style={{ width: 220 }}>
            <label>Tri</label>
            <select
              className="input"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="featured">Mise en avant</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                setFilters({ ...filters, inStock: e.target.checked })
              }
            />
            En stock seulement
          </label>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          text="Aucun produit ne correspond aux filtres."
          action={
            <Link className="btn" to="/catalog">
              Réinitialiser
            </Link>
          }
        />
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              actions={
                <div className="row wrap">
                  <Link className="btn" to={`/product/${p.slug}`}>
                    Voir
                  </Link>
                  <button
                    className="btn primary"
                    disabled={p.stockQty <= 0}
                    onClick={() => add(p.id, 1)}
                  >
                    Ajouter
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
