import { useState } from "react";
import { usePromoStore } from "../../stores/promoStore";

const blank = { id:"", code:"", type:"PERCENT", value:10, active:true };

export default function AdminPromos(){
  const promos = usePromoStore((s) => s.promos);
  const upsert = usePromoStore((s) => s.upsert);
  const toggleActive = usePromoStore((s) => s.toggleActive);
  const remove = usePromoStore((s) => s.remove);

  const [editing, setEditing] = useState(blank);

  return (
    <div className="col">
      <h2 style={{ marginTop: 0 }}>Codes promo</h2>

      <div className="row wrap">
        <div style={{ flex: 1, minWidth: 360 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Valeur</th>
                <th>Actif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.code}</strong></td>
                  <td>{p.type}</td>
                  <td>{p.type === "PERCENT" ? p.value + "%" : p.value + "€"}</td>
                  <td>{p.active ? "Oui" : "Non"}</td>
                  <td>
                    <div className="row wrap">
                      <button className="btn" onClick={() => setEditing(p)}>Éditer</button>
                      <button className="btn" onClick={() => toggleActive(p.id)}>{p.active ? "Désactiver" : "Activer"}</button>
                      <button className="btn danger" onClick={() => remove(p.id)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {promos.length === 0 ? <tr><td colSpan="5" className="muted">Aucun code.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div style={{ width: 420, maxWidth:"100%" }} className="col">
          <div style={{ fontWeight: 900 }}>Éditeur</div>

          <div className="row wrap">
            <button className="btn" onClick={() => setEditing(blank)}>Nouveau</button>
            <button className="btn primary" onClick={() => { upsert(editing); setEditing(blank); }}>Enregistrer</button>
          </div>

          <div>
            <label>Code</label>
            <input className="input" value={editing.code} onChange={(e)=>setEditing({ ...editing, code: e.target.value })} placeholder="UP10" />
          </div>

          <div className="row wrap">
            <div style={{ flex: 1 }}>
              <label>Type</label>
              <select className="input" value={editing.type} onChange={(e)=>setEditing({ ...editing, type: e.target.value })}>
                <option value="PERCENT">PERCENT</option>
                <option value="AMOUNT">AMOUNT</option>
              </select>
            </div>
            <div style={{ width: 160 }}>
              <label>Valeur</label>
              <input className="input" type="number" min="0" value={editing.value} onChange={(e)=>setEditing({ ...editing, value: Number(e.target.value || 0) })} />
            </div>
          </div>

          <label style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input type="checkbox" checked={!!editing.active} onChange={(e)=>setEditing({ ...editing, active: e.target.checked })} />
            Actif
          </label>

          <div className="small">Test: va au panier/checkout et mets le code.</div>
        </div>
      </div>
    </div>
  );
}
