import { Link } from "react-router-dom";
import { eur } from "../lib/money";

export default function ProductCard({ product, actions }) {
  return (
    <div className="glass card product-card">
      <Link to={`/product/${product.slug}`}>
        <img src={product.images?.[0]} alt={product.name} />
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
