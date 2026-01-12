import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { useAuthStore } from "../stores/authStore";

export default function LoginPage(){
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(){
    setError("");
    const fn = mode === "login" ? login : register;
    const res = fn(email, password);
    if (!res.ok) return setError(res.error || "Erreur.");
    navigate("/account");
  }

  return (
    <div className="col" style={{ maxWidth: 620 }}>
      <SectionTitle
        title={mode === "login" ? "Connexion" : "Inscription"}
        subtitle="Client: email quelconque. Admin: admin@up.local"
        right={<Link className="btn" to="/account">Compte</Link>}
      />

      <div className="glass card">
        <div className="row wrap">
          <button className={"btn " + (mode === "login" ? "primary" : "")} onClick={() => setMode("login")}>Connexion</button>
          <button className={"btn " + (mode === "register" ? "primary" : "")} onClick={() => setMode("register")}>Inscription</button>
        </div>

        <div className="col" style={{ marginTop: 12 }}>
          <div>
            <label>Email</label>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div>
            <label>Mot de passe</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>

          {error ? <div className="glass card" style={{ borderColor: "rgba(239,68,68,0.35)", color:"#991b1b" }}>{error}</div> : null}

          <button className="btn primary" onClick={submit}>
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
