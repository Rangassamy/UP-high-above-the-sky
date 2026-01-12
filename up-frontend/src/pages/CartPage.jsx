import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
import { eur } from "../lib/money";

export default function CartPage(){
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const getById = useProductStore((s) => s.getById);

  const lines = items.map(it => {
    const p = getById(it.productId);
    if (!p) return null;
    return { ...it, product: p, lineTotal: p.price * it.qty };
  }).filter(Boolean);

  const subtotal = lines.reduce((s,l)=>s+l.lineTotal,0);

  return (
    <div className="col">
      <SectionTitle
        title="Panier"
        subtitle="Vérifie tes articles avant paiement."
        right={<Link className="btn" to="/catalog">Continuer les achats</Link>}
      />

      {lines.length === 0 ? (
        <EmptyState
          title="Panier vide"
          text="Ajoute un produit depuis le catalogue."
          action={<Link className="btn primary" to="/catalog">Aller au catalogue</Link>}
        />
      ) : (
        <div className="two-col">
          <div className="glass card">
            <div className="col">
              {lines.map((l) => (
                <div key={l.productId} className="row wrap" style={{ alignItems:"center", justifyContent:"space-between" }}>
                  <div className="row" style={{ alignItems:"center" }}>
                    <img
                      src={l.product.images?.[0]}
                      alt={l.product.name}
                      style={{ width: 110, height: 78, objectFit:"cover", borderRadius: 14, border:"1px solid var(--border)" }}
                    />
                    <div>
                      <div style={{ fontWeight: 900 }}>{l.product.name}</div>
                      <div className="small">{eur(l.product.price)}</div>
                    </div>
                  </div>

                  <div className="row wrap" style={{ alignItems:"center", justifyContent:"flex-end" }}>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={l.qty}
                      onChange={(e) => setQty(l.productId, e.target.value)}
                      style={{ width: 90 }}
                    />
                    <div style={{ minWidth: 110, textAlign:"right", fontWeight: 900 }}>{eur(l.lineTotal)}</div>
                    <button className="btn danger" onClick={() => remove(l.productId)}>Supprimer</button>
                  </div>
                </div>
              ))}

              <div className="hr" />

              <div className="row wrap" style={{ justifyContent:"space-between", alignItems:"center" }}>
                <button className="btn" onClick={clear}>Vider le panier</button>
                <div className="small">Sous-total: <strong>{eur(subtotal)}</strong></div>
              </div>
            </div>
          </div>

          <aside className="glass card">
            <div style={{ fontWeight: 900, fontSize: 18 }}>Récap</div>

            <div className="kpi" style={{ marginTop: 10 }}>
              <span className="muted">Sous-total</span>
              <strong>{eur(subtotal)}</strong>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Code promo</label>
              <input
                className="input"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Ex: UP10"
              />
              <div className="small" style={{ marginTop: 6 }}>Le code sera validé au checkout.</div>
            </div>

            <div className="row wrap" style={{ marginTop: 14 }}>
              <button className="btn primary" onClick={() => navigate("/checkout")}>Passer au paiement</button>
              <Link className="btn" to="/catalog">Catalogue</Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
