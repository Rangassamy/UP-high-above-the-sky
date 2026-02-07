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
import { PromosAPI } from "../api/promos";

function computeDiscount(subtotal, promo) {
  if (!promo) return 0;
  if (promo.type === "PERCENT")
    return Math.round(subtotal * (promo.value / 100));
  if (promo.type === "AMOUNT") return Math.min(subtotal, promo.value);
  return 0;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const clear = useCartStore((s) => s.clear);
  const syncFromServer = useCartStore((s) => s.syncFromServer);

  const getById = useProductStore((s) => s.getById);
  const findActivePromo = usePromoStore((s) => s.findActive);

  const createOrder = useOrderStore((s) => s.createOrder);

  const lines = items
    .map((it) => {
      const p = getById(it.productId);
      if (!p) return null;
      return { ...it, product: p, lineTotal: p.price * it.qty };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

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
    if (!form.name || !form.email || !form.address1 || !form.city || !form.zip)
      return false;
    return true;
  }, [lines.length, form]);

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Checkout"
        text="Ton panier est vide."
        action={
          <Link className="btn primary" to="/catalog">
            Aller au catalogue
          </Link>
        }
      />
    );
  }

  return (
    <div className="col">
      <SectionTitle
        title="Paiement"
        subtitle="Commande créée côté serveur."
        right={
          <Link className="btn" to="/cart">
            Retour panier
          </Link>
        }
      />

      <div className="two-col">
        <div className="glass card">
          <h2 style={{ marginTop: 0 }}>Informations</h2>

          <div className="col">
            <div>
              <label>Nom</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label>Adresse</label>
              <input
                className="input"
                value={form.address1}
                onChange={(e) => setForm({ ...form, address1: e.target.value })}
              />
            </div>

            <div className="row wrap">
              <div style={{ flex: 1 }}>
                <label>Ville</label>
                <input
                  className="input"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div style={{ width: 160 }}>
                <label>Code postal</label>
                <input
                  className="input"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                />
              </div>
            </div>

            <div className="hr" />

            <div className="small">
              En vrai paiement: Stripe + webhook (quand tu demanderas le
              backend).
            </div>
          </div>
        </div>

        <aside className="glass card">
          <h2 style={{ marginTop: 0 }}>Récap commande</h2>

          <div className="col">
            {lines.map((l) => (
              <div key={l.productId} className="kpi">
                <span className="muted">
                  {l.qty}× {l.product.name}
                </span>
                <strong>{eur(l.lineTotal)}</strong>
              </div>
            ))}

            <div className="hr" />

            <div className="kpi">
              <span className="muted">Sous-total</span>
              <strong>{eur(subtotal)}</strong>
            </div>
            <div className="kpi">
              <span className="muted">Code promo</span>
              <strong>{promo ? promo.code : "—"}</strong>
            </div>
            <div className="kpi">
              <span className="muted">Réduction</span>
              <strong>{discount ? "-" + eur(discount) : "—"}</strong>
            </div>
            <div className="kpi">
              <span className="muted">Total</span>
              <strong>{eur(total)}</strong>
            </div>

            <button
              className="btn primary"
              disabled={!canPay}
              onClick={async () => {
                // Backend expects promo_id (not promo code). Validate code to get its id.
                let promoId = null;
                const code = String(promoCode || "").trim();

                if (code) {
                  try {
                    const vr = await PromosAPI.validate(code);
                    if (vr?.success && vr?.content?.enable) {
                      promoId = vr.content.id;
                    }
                  } catch {
                    // Ignore promo validation errors here; backend will still create the order without promo.
                  }
                }

                const order = await createOrder({ promoId });

                // Backend clears the server cart on /buy, so resync.
                await syncFromServer();

                // Also clear local UI state (promo, etc.)
                clear();

                if (order?.id) {
                  navigate("/account", { state: { createdOrderId: order.id } });
                }
              }}
            >
              Payer
            </button>

            <div className="small">
              La commande est créée à partir du panier serveur.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
