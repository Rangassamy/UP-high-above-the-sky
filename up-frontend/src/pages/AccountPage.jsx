import { useEffect, useState } from "react";
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

export default function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useOrderStore((s) => s.orders);
  const fetchMyOrders = useOrderStore((s) => s.fetchMyOrders);
  const ordersLoading = useOrderStore((s) => s.loading);
  const ordersError = useOrderStore((s) => s.error);

  const [tab, setTab] = useState("orders");
  const createdOrderId = location.state?.createdOrderId;

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user, fetchMyOrders]);

  if (!user) return null;

  return (
    <div className="col">
      <SectionTitle
        title="Mon compte"
        subtitle={user.email + (user.role === "admin" ? " • admin" : "")}
        right={
          <div className="row wrap">
            {user.role === "admin" ? (
              <Link className="btn" to="/admin">
                Admin
              </Link>
            ) : null}
            <button
              className="btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Déconnexion
            </button>
          </div>
        }
      />

      <div className="glass card">
        <div className="row wrap">
          <button
            className={"btn " + (tab === "orders" ? "primary" : "")}
            onClick={() => setTab("orders")}
          >
            Commandes
          </button>
          <button
            className={"btn " + (tab === "profile" ? "primary" : "")}
            onClick={() => setTab("profile")}
          >
            Profil
          </button>
        </div>

        {tab === "profile" ? (
          <div className="col" style={{ marginTop: 12 }}>
            <div className="kpi">
              <span className="muted">Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="small">
              Profil minimal. Le backend ajoutera plus tard des champs.
            </div>
          </div>
        ) : (
          <div className="col" style={{ marginTop: 12 }}>
            {createdOrderId ? (
              <div className="glass card" style={{ borderStyle: "dashed" }}>
                <div style={{ fontWeight: 900 }}>Commande enregistrée</div>
                <div className="small">ID : {createdOrderId}</div>
              </div>
            ) : null}

            {ordersError ? (
              <div className="glass card" style={{ borderStyle: "dashed" }}>
                <div style={{ fontWeight: 900 }}>
                  Erreur chargement commandes
                </div>
                <div className="small">{ordersError}</div>
              </div>
            ) : ordersLoading ? (
              <div className="small">Chargement...</div>
            ) : orders.length === 0 ? (
              <EmptyState
                title="Aucune commande"
                text="Fais une commande via le checkout."
                action={
                  <Link className="btn primary" to="/catalog">
                    Aller au catalogue
                  </Link>
                }
              />
            ) : (
              <div className="col">
                {orders.map((o) => (
                  <div key={o.id} className="glass card">
                    <div
                      className="row wrap"
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 900 }}>{o.id}</div>
                        <div className="small">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 900 }}>{eur(o.total)}</div>
                        <div className="small">
                          {statusLabel[o.status] || o.status}
                        </div>
                      </div>
                    </div>

                    <div className="hr" />

                    <div className="small">
                      Commande créée à partir du panier serveur.
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
