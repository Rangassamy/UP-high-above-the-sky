import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";

const label = { caps: "Casquettes", vetements: "Vêtements" };

export default function CategoryPage() {
  const navigate = useNavigate();
  const { category } = useParams();

  const productsAll = useProductStore((s) => s.products);
  const add = useCartStore((s) => s.add);

  const products = useMemo(() => {
    return productsAll.filter((p) => p.active && p.category === category);
  }, [productsAll, category]);

  return (
    <div className="col">
      <SectionTitle
        title={label[category] || category}
        subtitle="Selection de la categorie"
        right={
          <Link className="btn" to="/catalog">
            Retour catalogue
          </Link>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          title="Aucun produit"
          text="Aucun produit dans cette catégorie."
          action={
            <Link className="btn" to="/catalog">
              Voir tout
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
                    onClick={async () => {
                      const res = await add(p.id, 1);
                      if (res?.error === "login_required") navigate("/login");
                    }}
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
