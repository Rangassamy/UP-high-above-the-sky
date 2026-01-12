import { useMemo, useState } from "react";
import { useOrderStore } from "../../stores/orderStore";
import { eur } from "../../lib/money";

const statuses = [
  { value: "EN_PREPARATION", label: "En préparation" },
  { value: "EXPEDIEE", label: "Expédiée" },
  { value: "LIVREE", label: "Livrée" },
  { value: "ANNULEE", label: "Annulée" },
];

export default function AdminOrders() {
  const orders = useOrderStore((s) => s.adminList());
  const setStatus = useOrderStore((s) => s.setStatus);

  const [selectedId, setSelectedId] = useState("");

  const selected = useMemo(
    () => orders.find((o) => o.id === selectedId) || null,
    [orders, selectedId]
  );

  return (
    <div className="col">
      <h2 style={{ marginTop: 0 }}>Commandes</h2>

      <div className="row wrap">
        <div style={{ flex: 1, minWidth: 360 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <strong>{o.id}</strong>
                  </td>
                  <td>{o.email}</td>
                  <td>{eur(o.total)}</td>
                  <td>{o.status}</td>
                  <td className="small">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="muted">
                    Aucune commande.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={{ width: 360, maxWidth: "100%" }}>
          <div style={{ fontWeight: 900 }}>Détails</div>

          {!selected ? (
            <div className="small">Clique une commande.</div>
          ) : (
            <div className="col" style={{ marginTop: 10 }}>
              <div className="kpi">
                <span className="muted">ID</span>
                <strong>{selected.id}</strong>
              </div>
              <div className="kpi">
                <span className="muted">Client</span>
                <strong>{selected.email}</strong>
              </div>
              <div className="kpi">
                <span className="muted">Total</span>
                <strong>{eur(selected.total)}</strong>
              </div>
              <div className="kpi">
                <span className="muted">Promo</span>
                <strong>{selected.promoCode || "—"}</strong>
              </div>

              <div>
                <label>Statut</label>
                <select
                  className="input"
                  value={selected.status}
                  onChange={(e) => setStatus(selected.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="glass card">
                <div style={{ fontWeight: 900 }}>Adresse</div>
                <div className="small">{selected.name}</div>
                <div className="small">{selected.address1}</div>
                <div className="small">
                  {selected.zip} {selected.city}
                </div>
              </div>

              <div className="glass card">
                <div style={{ fontWeight: 900 }}>Articles</div>
                <div className="col" style={{ marginTop: 8 }}>
                  {(selected.items || []).map((it, idx) => (
                    <div key={idx} className="kpi">
                      <span className="muted">
                        {it.qty}× {it.name}
                      </span>
                      <strong>{eur(it.lineTotal)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
