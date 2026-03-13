import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import { eur } from "../lib/money";

export default function HomePage() {
  const navigate = useNavigate();
  const productsAll = useProductStore((s) => s.products);
  const add = useCartStore((s) => s.add);

  const featured = useMemo(() => {
    const pub = productsAll.filter((p) => p.active);
    return pub.find((p) => p.featured) || pub[0] || null;
  }, [productsAll]);

  return (
    <div className="col">
      <SectionTitle
        title="UP"
        subtitle="Collection fictive de vetements et accessoires inspires des lignes du ciel."
        right={
          <Link className="btn primary" to="/catalog">
            Aller au catalogue
          </Link>
        }
      />

      <div className="glass card">
        <div
          className="row wrap"
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ maxWidth: 520 }}>
            <div className="pills">
              <span className="pill">Nuages</span>
              <span className="pill">Minimal</span>
              <span className="pill">UP</span>
            </div>

            <h2 style={{ margin: "12px 0 6px 0" }}>Produit mis en avant</h2>
            {featured ? (
              <>
                <div style={{ fontWeight: 900, fontSize: 22 }}>
                  {featured.name}
                </div>
                <div className="muted" style={{ marginTop: 6 }}>
                  {eur(featured.price)} •{" "}
                  {featured.stockQty > 0 ? "En stock" : "Rupture"}
                </div>
                <div className="muted" style={{ marginTop: 10 }}>
                  {featured.description}
                </div>

                <div className="row wrap" style={{ marginTop: 14 }}>
                  <Link className="btn" to={`/product/${featured.slug}`}>
                    Voir la fiche
                  </Link>
                  <Link className="btn" to={`/category/${featured.category}`}>
                    Voir la catégorie
                  </Link>
                  <button
                    className="btn primary"
                    disabled={featured.stockQty <= 0}
                    onClick={async () => {
                      const res = await add(featured.id, 1);
                      if (res?.error === "login_required") navigate("/login");
                    }}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </>
            ) : (
              <div className="muted">Aucun produit.</div>
            )}
          </div>

          <div style={{ width: 460, maxWidth: "100%" }}>
            <img
              src={featured?.images?.[0] || "/image.png"}
              alt={featured?.name || "UP"}
              style={{
                width: "100%",
                height: 300,
                objectFit: "cover",
                borderRadius: 18,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.6)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="row wrap">
        <div className="glass card" style={{ flex: 1 }}>
          <div style={{ fontWeight: 900 }}>Casquettes</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Des modeles simples, portables et faciles a expliquer dans une demo.
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" to="/category/caps">
              Voir
            </Link>
          </div>
        </div>

        <div className="glass card" style={{ flex: 1 }}>
          <div style={{ fontWeight: 900 }}>Vêtements</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Hoodies, sweats et packs textiles dans le meme univers graphique.
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" to="/category/vetements">
              Voir
            </Link>
          </div>
        </div>

        <div className="glass card" style={{ flex: 1 }}>
          <div style={{ fontWeight: 900 }}>Promos</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Le code promo UP10 permet de tester facilement la reduction au checkout.
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="btn" to="/catalog">
              Voir produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
