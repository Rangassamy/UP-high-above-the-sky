import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import EmptyState from "../components/EmptyState";
import { useAuthStore } from "../stores/authStore";
import { useOrderStore } from "../stores/orderStore";
import { eur } from "../lib/money";

const statusLabel = {
  EN_PREPARATION: "En préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export default function AccountPage(){
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const listForEmail = useOrderStore((s) => s.listForEmail);

  const [tab, setTab] = useState("orders");
  const createdOrderId = location.state?.createdOrderId;

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const orders = useMemo(() => listForEmail(user?.email), [user?.email]);

  if (!user) return null;

  return (
    <div className="col">
      <SectionTitle
        title="Mon compte"
        subtitle={user.email + (user.role === "admin" ? " • admin" : "")}
        right={
          <div className="row wrap">
            {user.role === "admin" ? <Link className="btn" to="/admin">Admin</Link> : null}
            <button className="btn" onClick={() => { logout(); navigate("/"); }}>Déconnexion</button>
          </div>
        }
      />

      <div className="glass card">
        <div className="row wrap">
          <button className={"btn " + (tab === "orders" ? "primary" : "")} onClick={() => setTab("orders")}>Commandes</button>
          <button className={"btn " + (tab === "profile" ? "primary" : "")} onClick={() => setTab("profile")}>Profil</button>
        </div>

        {tab === "profile" ? (
          <div className="col" style={{ marginTop: 12 }}>
            <div className="kpi"><span className="muted">Email</span><strong>{user.email}</strong></div>
            <div className="small">Profil minimal. Le backend ajoutera plus tard des champs.</div>
          </div>
        ) : (
          <div className="col" style={{ marginTop: 12 }}>
            {createdOrderId ? (
              <div className="glass card" style={{ borderStyle: "dashed" }}>
                <div style={{ fontWeight: 900 }}>Commande enregistrée</div>
                <div className="small">ID : {createdOrderId}</div>
              </div>
            ) : null}

            {orders.length === 0 ? (
              <EmptyState
                title="Aucune commande"
                text="Fais une commande via le checkout."
                action={<Link className="btn primary" to="/catalog">Aller au catalogue</Link>}
              />
            ) : (
              <div className="col">
                {orders.map((o) => (
                  <div key={o.id} className="glass card">
                    <div className="row wrap" style={{ justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>{o.id}</div>
                        <div className="small">{new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontWeight: 900 }}>{eur(o.total)}</div>
                        <div className="small">{statusLabel[o.status] || o.status}</div>
                      </div>
                    </div>

                    <div className="hr" />

                    <div className="small">
                      {o.items?.length || 0} article(s) • Promo: {o.promoCode || "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
