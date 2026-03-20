/* Carte produit standard utilisee dans le catalogue et les categories. */

import { Link } from "react-router-dom";
import { resolveImageUrl } from "../lib/images";
import { eur } from "../lib/money";

export default function ProductCard({ product, actions }) {
  const image = resolveImageUrl(product.images?.[0]);

  return (
    <div className="glass card product-card">
      <Link to={`/product/${product.slug}`}>
        <img src={image} alt={product.name} />
      </Link>
      <div className="col" style={{ gap: 8, marginTop: 10 }}>
        <div style={{ fontWeight: 900 }}>{product.name}</div>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div className="muted">{eur(product.price)}</div>
          <div className="pill">{product.stockQty > 0 ? "En stock" : "Rupture"}</div>
        </div>
        {actions}
      </div>
    </div>
  );
}
