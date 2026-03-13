import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
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
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const syncFromServer = useCartStore((s) => s.syncFromServer);

  const getById = useProductStore((s) => s.getById);
  const createOrder = useOrderStore((s) => s.createOrder);
  const orderLoading = useOrderStore((s) => s.loading);
  const orderError = useOrderStore((s) => s.error);

  const lines = items
    .map((it) => {
      const p = getById(it.productId);
      if (!p) return null;
      return { ...it, product: p, lineTotal: p.price * it.qty };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  const normalizedPromoCode = String(promoCode || "").trim();
  const [promoState, setPromoState] = useState({
    code: "",
    promo: null,
    message: "",
  });
  const promo =
    promoState.code === normalizedPromoCode ? promoState.promo : null;
  const promoMessage =
    promoState.code === normalizedPromoCode ? promoState.message : "";
  const discount = computeDiscount(subtotal, promo);
  const total = Math.max(0, subtotal - discount);

  const [form, setForm] = useState({
    name: user?.username || "",
    email: user?.email || "",
    address1: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    let cancelled = false;
    if (!normalizedPromoCode) return () => {};

    PromosAPI.validate(normalizedPromoCode)
      .then((res) => {
        if (cancelled) return;
        if (res?.success && res?.content?.enable) {
          setPromoState({
            code: normalizedPromoCode,
            promo: res.content,
            message: `Code ${res.content.code} applique.`,
          });
          return;
        }
        setPromoState({
          code: normalizedPromoCode,
          promo: null,
          message: "Code promo invalide ou desactive.",
        });
      })
      .catch(() => {
        if (cancelled) return;
        setPromoState({
          code: normalizedPromoCode,
          promo: null,
          message: "Impossible de verifier le code promo.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedPromoCode]);

  const canPay = Boolean(
    lines.length > 0 &&
      form.name &&
      form.email &&
      form.address1 &&
      form.city &&
      form.zip,
  );

  if (!user) {
    return (
      <EmptyState
        title="Connexion requise"
        text="Connecte-toi pour finaliser ta commande."
        action={<Link className="btn primary" to="/login">Aller au login</Link>}
      />
    );
  }

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
        subtitle="Simulation de paiement avec enregistrement cote serveur."
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
              Le paiement reste volontairement simule pour conserver un projet
              simple, lisible et facile a expliquer.
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
              <strong>{promo ? promo.code : promoCode ? "Invalide" : "—"}</strong>
            </div>
            <div className="kpi">
              <span className="muted">Réduction</span>
              <strong>{discount ? "-" + eur(discount) : "—"}</strong>
            </div>
            <div className="kpi">
              <span className="muted">Total</span>
              <strong>{eur(total)}</strong>
            </div>

            {promoMessage ? <div className="small">{promoMessage}</div> : null}
            {orderError ? (
              <div
                className="glass card"
                style={{ borderColor: "rgba(239,68,68,0.35)", color: "#991b1b" }}
              >
                {orderError}
              </div>
            ) : null}

            <button
              className="btn primary"
              disabled={!canPay || orderLoading}
              onClick={async () => {
                const order = await createOrder({
                  promoId: promo?.id || null,
                  payload: {
                    name: form.name,
                    email: form.email,
                    address1: form.address1,
                    city: form.city,
                    zip: form.zip,
                  },
                });

                // Backend clears the server cart on /buy, so resync.
                await syncFromServer();

                if (order?.id) {
                  setPromoCode("");
                  navigate("/account", { state: { createdOrderId: order.id } });
                }
              }}
            >
              {orderLoading ? "Paiement..." : "Payer"}
            </button>

            <div className="small">
              La commande est creee a partir du panier serveur puis consultable
              dans l'espace compte.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
