import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import { eur } from "../lib/money";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);

  const productsAll = useProductStore((s) => s.products);

  const product = useMemo(() => {
    return productsAll.find((p) => p.slug === slug) || null;
  }, [productsAll, slug]);

  if (!product || !product.active) {
    return (
      <EmptyState
        title="Produit introuvable"
        text="Ce produit n'existe pas ou n'est plus disponible."
        action={
          <Link className="btn" to="/catalog">
            Retour catalogue
          </Link>
        }
      />
    );
  }

  return (
    <div className="col">
      <SectionTitle
        title={product.name}
        subtitle={`${eur(product.price)} • ${
          product.stockQty > 0 ? "En stock" : "Rupture"
        }`}
        right={
          <Link className="btn" to={`/category/${product.category}`}>
            Retour catégorie
          </Link>
        }
      />

      <div className="row wrap">
        <div className="glass card" style={{ flex: 1 }}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            style={{
              width: "100%",
              height: 420,
              objectFit: "cover",
              borderRadius: 18,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.6)",
            }}
          />
        </div>

        <div className="glass card" style={{ width: 420, maxWidth: "100%" }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Détails</div>
          <div className="muted" style={{ marginTop: 8 }}>
            {product.description}
          </div>

          <div style={{ marginTop: 14 }}>
            <label>Quantité</label>
            <input
              className="input"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            />
          </div>

          <div className="row wrap" style={{ marginTop: 14 }}>
            <button
              className="btn primary"
              disabled={product.stockQty <= 0}
              onClick={() => {
                add(product.id, qty);
                navigate("/cart");
              }}
            >
              Ajouter au panier
            </button>
            <Link className="btn" to="/cart">
              Voir panier
            </Link>
          </div>

          <div className="hr" />

          <div className="small">
            Catégorie:{" "}
            <Link to={`/category/${product.category}`}>{product.category}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
