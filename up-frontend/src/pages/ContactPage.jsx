import { useState } from "react";
import SectionTitle from "../components/SectionTitle";

export default function ContactPage(){
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);

  return (
    <div className="col" style={{ maxWidth: 760 }}>
      <SectionTitle
        title="Contact"
        subtitle="Formulaire classique."
      />

      <form
        className="glass card col"
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      >
        <div className="row wrap">
          <div style={{ flex: 1 }}>
            <label>Nom</label>
            <input className="input" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Email</label>
            <input className="input" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div>
          <label>Sujet</label>
          <input className="input" value={form.subject} onChange={(e)=>setForm({ ...form, subject: e.target.value })} />
        </div>

        <div>
          <label>Message</label>
          <textarea rows="6" className="input" value={form.message} onChange={(e)=>setForm({ ...form, message: e.target.value })} />
        </div>

        <button className="btn primary" type="submit">Envoyer</button>

        {sent ? (
          <div className="glass card" style={{ borderColor: "rgba(34,197,94,0.35)", color:"#166534" }}>
            Message envoyé (simulation).
          </div>
        ) : null}

        <div className="small">
          Email: contact@up.local • Instagram: @up
        </div>
      </form>
    </div>
  );
}
