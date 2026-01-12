import { NavLink, Outlet, useNavigate } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle";
import EmptyState from "../../components/EmptyState";
import { useAuthStore } from "../../stores/authStore";

export default function AdminPage(){
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <EmptyState
        title="Admin"
        text="Connecte-toi."
        action={<button className="btn primary" onClick={() => navigate("/login")}>Aller au login</button>}
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <EmptyState
        title="Accès refusé"
        text="Tu n'es pas admin."
        action={<button className="btn" onClick={() => navigate("/")}>Retour</button>}
      />
    );
  }

  return (
    <div className="col">
      <SectionTitle title="Admin" subtitle="Produits • Stock • Commandes • Promos" />

      <div className="admin-shell">
        <aside className="glass card sidebar">
          <NavLink to="/admin/products" className={({isActive}) => isActive ? "active" : ""}>Produits</NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => isActive ? "active" : ""}>Commandes</NavLink>
          <NavLink to="/admin/promos" className={({isActive}) => isActive ? "active" : ""}>Codes promo</NavLink>
          <div className="hr" />
          <button className="btn" onClick={() => navigate("/")}>Retour site</button>
        </aside>

        <section className="glass card">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
