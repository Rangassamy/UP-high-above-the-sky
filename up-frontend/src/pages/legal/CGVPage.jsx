import SectionTitle from "../../components/SectionTitle";

export default function CGVPage(){
  return (
    <div className="col" style={{ maxWidth: 900 }}>
      <SectionTitle title="CGV" subtitle="Texte placeholder. À remplacer." />
      <div className="glass card">
        <div className="muted">
          Délais, livraison, retours, remboursement, contact, etc. (À écrire).
        </div>
      </div>
    </div>
  );
}
