/*
 * Layout principal partage par toutes les pages.
 * Il charge les produits, le profil utilisateur et le panier, puis affiche
 * la navigation globale et le pied de page.
 */

import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useProductStore } from "../stores/productStore";

export default function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const resetCart = useCartStore((s) => s.resetLocal);
  const count = useCartStore((s) =>
    user ? s.items.reduce((sum, it) => sum + it.qty, 0) : 0,
  );
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const token = useAuthStore((s) => s.token);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    // Le catalogue est charge des l'arrivee sur le site pour alimenter toutes les pages.
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Si un token existe deja, on tente de reconstituer la session utilisateur.
    fetchMe();
  }, [token, fetchMe]);

  useEffect(() => {
    // Le panier est conserve cote serveur ; on le recharge apres identification.
    if (user) syncFromServer();
  }, [user, token, syncFromServer]);

  return (
    <>
      <div className="navbar">
        <div className="navbar-inner glass">
          <div className="row" style={{ alignItems: "center", gap: 14 }}>
            <div
              className="brand"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/")}
            >
              UP
            </div>

            <div className="navlinks">
              <NavLink className="btn ghost" to="/catalog">
                Catalogue
              </NavLink>
              <NavLink className="btn ghost" to="/category/caps">
                Casquettes
              </NavLink>
              <NavLink className="btn ghost" to="/category/vetements">
                Vêtements
              </NavLink>
              <NavLink className="btn ghost" to="/contact">
                Contact
              </NavLink>
            </div>
          </div>

          <SearchMini />

          <div className="row" style={{ alignItems: "center", gap: 10 }}>
            <button
              className="icon-btn"
              title="Compte"
              onClick={() => navigate(user ? "/account" : "/login")}
            >
              👤
            </button>

            <button
              className="icon-btn"
              title="Panier"
              onClick={() => navigate("/cart")}
            >
              🛒
              {count > 0 ? (
                <span className="badge" style={{ marginLeft: 6 }}>
                  {count}
                </span>
              ) : null}
            </button>

            {user?.role === "admin" ? (
              <button
                className="icon-btn"
                title="Admin"
                onClick={() => navigate("/admin")}
              >
                🛠
              </button>
            ) : null}

            {user ? (
              <button
                className="btn"
                onClick={async () => {
                  await logout();
                  resetCart();
                  navigate("/");
                }}
              >
                Déconnexion
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <main className="container">
        <Outlet />
        <footer className="footer">
          <div
            className="row wrap"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div className="small">© UP</div>
            <div className="row wrap">
              <NavLink className="small" to="/legal/mentions">
                Mentions
              </NavLink>
              <NavLink className="small" to="/legal/cgv">
                CGV
              </NavLink>
              <NavLink className="small" to="/legal/privacy">
                Confidentialité
              </NavLink>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function SearchMini() {
  /* Barre de recherche compacte placee dans la navigation. */
  const navigate = useNavigate();
  return (
    <form
      className="searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        navigate(`/catalog?q=${encodeURIComponent(String(q || "").trim())}`);
      }}
    >
      <input className="input" name="q" placeholder="Rechercher un produit…" />
      <button className="btn" type="submit">
        Rechercher
      </button>
    </form>
  );
}
