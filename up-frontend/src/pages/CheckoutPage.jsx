import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
import { usePromoStore } from "../stores/promoStore";
import { useOrderStore } from "../stores/orderStore";
import { useAuthStore } from "../stores/authStore";
import { eur } from "../lib/money";

function computeDiscount(subtotal, promo){
  if (!promo) return 0;
  if (promo.type === "PERCENT") return Math.round(subtotal * (promo.value / 100));
  if (promo.type === "AMOUNT") return Math.min(subtotal, promo.value);
  return 0;
}

export default function CheckoutPage(){
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const clear = useCartStore((s) => s.clear);

  const getById = useProductStore((s) => s.getById);
  const findActivePromo = usePromoStore((s) => s.findActive);

  const createOrder = useOrderStore((s) => s.createOrder);

  const lines = items.map(it => {
    const p = getById(it.productId);
    if (!p) return null;
    return { ...it, product: p, lineTotal: p.price * it.qty };
  }).filter(Boolean);

  const subtotal = lines.reduce((s,l)=>s+l.lineTotal,0);

  const promo = findActivePromo(promoCode);
  const discount = computeDiscount(subtotal, promo);
  const total = Math.max(0, subtotal - discount);

  const [form, setForm] = useState({
    name: "",
    email: user?.email || "",
    address1: "",
    city: "",
    zip: "",
  });

  const canPay = useMemo(() => {
    if (lines.length === 0) return false;
    if (!form.name || !form.email || !form.address1 || !form.city || !form.zip) return false;
    return true;
  }, [lines.length, form]);

  if (lines.length === 0){
    return (
      <EmptyState
        title="Checkout"
        text="Ton panier est vide."
        action={<Link className="btn primary" to="/catalog">Aller au catalogue</Link>}
      />
    );
  }

  return (
    <div className="col">
      <SectionTitle
        title="Paiement"
        subtitle="Paiement simulé (backend plus tard)."
        right={<Link className="btn" to="/cart">Retour panier</Link>}
      />

      <div className="two-col">
        <div className="glass card">
          <h2 style={{ marginTop: 0 }}>Informations</h2>

          <div className="col">
            <div>
              <label>Nom</label>
              <input className="input" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <label>Email</label>
              <input className="input" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label>Adresse</label>
              <input className="input" value={form.address1} onChange={(e)=>setForm({ ...form, address1: e.target.value })} />
            </div>

            <div className="row wrap">
              <div style={{ flex: 1 }}>
                <label>Ville</label>
                <input className="input" value={form.city} onChange={(e)=>setForm({ ...form, city: e.target.value })} />
              </div>
              <div style={{ width: 160 }}>
                <label>Code postal</label>
                <input className="input" value={form.zip} onChange={(e)=>setForm({ ...form, zip: e.target.value })} />
              </div>
            </div>

            <div className="hr" />

            <div className="small">
              En vrai paiement: Stripe + webhook (quand tu demanderas le backend).
            </div>
          </div>
        </div>

        <aside className="glass card">
          <h2 style={{ marginTop: 0 }}>Récap commande</h2>

          <div className="col">
            {lines.map((l) => (
              <div key={l.productId} className="kpi">
                <span className="muted">{l.qty}× {l.product.name}</span>
                <strong>{eur(l.lineTotal)}</strong>
              </div>
            ))}

            <div className="hr" />

            <div className="kpi"><span className="muted">Sous-total</span><strong>{eur(subtotal)}</strong></div>
            <div className="kpi"><span className="muted">Code promo</span><strong>{promo ? promo.code : "—"}</strong></div>
            <div className="kpi"><span className="muted">Réduction</span><strong>{discount ? "-" + eur(discount) : "—"}</strong></div>
            <div className="kpi"><span className="muted">Total</span><strong>{eur(total)}</strong></div>

            <button
              className="btn primary"
              disabled={!canPay}
              onClick={() => {
                const order = createOrder({
                  email: form.email,
                  name: form.name,
                  address1: form.address1,
                  city: form.city,
                  zip: form.zip,
                  items: lines.map(l => ({
                    productId: l.productId,
                    name: l.product.name,
                    unitPrice: l.product.price,
                    qty: l.qty,
                    lineTotal: l.lineTotal,
                  })),
                  promoCode: promo?.code || "",
                  subtotal,
                  discount,
                  total,
                });
                clear();
                navigate("/account", { state: { createdOrderId: order.id } });
              }}
            >
              Payer (simulation)
            </button>

            <div className="small">En admin, tu peux changer le statut.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
