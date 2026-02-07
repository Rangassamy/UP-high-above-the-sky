import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "../../stores/productStore";
import { makeSlug } from "../../lib/slug";

const blank = {
  id: "",
  name: "",
  slug: "",
  category: "caps",
  price: 39,
  description: "",
  images: ["https://via.placeholder.com/1200x800?text=UP+Product"],
  stockQty: 0,
  featured: false,
};

export default function AdminProducts() {
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const saveProduct = useProductStore((s) => s.saveProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [editing, setEditing] = useState(blank);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const ordered = useMemo(() => {
    const p = [...products];
    p.sort((a, b) => Number(b.featured) - Number(a.featured));
    return p;
  }, [products]);

  return (
    <div className="col">
      <h2 style={{ marginTop: 0 }}>Produits</h2>

      <div className="row wrap">
        <div className="col" style={{ flex: 1, minWidth: 360 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Cat</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <div className="small">{p.slug}</div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.price}€</td>
                  <td>
                    <input
                      className="input"
                      style={{ width: 90 }}
                      type="number"
                      min="0"
                      defaultValue={p.stockQty}
                      onBlur={async (e) => {
                        const v = Number(e.target.value || 0);
                        await saveProduct({ ...p, stockQty: v });
                      }}
                    />
                  </td>
                  <td>
                    <div className="row wrap">
                      <button className="btn" onClick={() => setEditing(p)}>
                        Éditer
                      </button>
                      <button
                        className="btn"
                        onClick={async () => {
                          await saveProduct({ ...p, featured: !p.featured });
                        }}
                      >
                        {p.featured ? "Vedette" : "Mettre vedette"}
                      </button>
                      <button
                        className="btn danger"
                        onClick={async () => {
                          await deleteProduct(p.id);
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ordered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="muted">
                    Aucun produit.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="col" style={{ width: 360, maxWidth: "100%" }}>
          <div style={{ fontWeight: 900 }}>Éditeur</div>
          <div className="small">Créer ou modifier un produit.</div>

          <div className="row wrap">
            <button className="btn" onClick={() => setEditing(blank)}>
              Nouveau
            </button>
            <button
              className="btn primary"
              onClick={async () => {
                const next = { ...editing };
                if (!next.slug) next.slug = makeSlug(next.name);
                next.images = [
                  String(next.images?.[0] || "").trim() || blank.images[0],
                ];
                await saveProduct(next);
                setEditing(blank);
              }}
            >
              Enregistrer
            </button>
          </div>

          <div>
            <label>Nom</label>
            <input
              className="input"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
          </div>

          <div>
            <label>Slug</label>
            <input
              className="input"
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            />
            <div className="small">Vide = auto à partir du nom.</div>
          </div>

          <div className="row wrap">
            <div style={{ flex: 1 }}>
              <label>Catégorie</label>
              <select
                className="input"
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                <option value="caps">caps</option>
                <option value="vetements">vetements</option>
              </select>
            </div>
            <div style={{ width: 140 }}>
              <label>Prix (€)</label>
              <input
                className="input"
                type="number"
                min="0"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value || 0) })
                }
              />
            </div>
          </div>

          <div>
            <label>Description</label>
            <textarea
              className="input"
              rows="4"
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
          </div>

          <div>
            <label>Image URL (V1)</label>
            <input
              className="input"
              value={editing.images?.[0] || ""}
              onChange={(e) =>
                setEditing({ ...editing, images: [e.target.value] })
              }
            />
          </div>

          <div className="row wrap" style={{ alignItems: "center" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={!!editing.featured}
                onChange={(e) =>
                  setEditing({ ...editing, featured: e.target.checked })
                }
              />
              Vedette
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                min="0"
                className="input"
                style={{ width: 120 }}
                value={editing.stockQty}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    stockQty: Number(e.target.value || 0),
                  })
                }
              />
              Stock
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
