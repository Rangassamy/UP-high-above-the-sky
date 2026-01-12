import SectionTitle from "../../components/SectionTitle";

export default function MentionsPage(){
  return (
    <div className="col" style={{ maxWidth: 900 }}>
      <SectionTitle title="Mentions légales" subtitle="Texte placeholder." />
      <div className="glass card">
        <div className="muted">
          Éditeur du site, hébergeur, contact, etc. (À écrire).
        </div>
      </div>
    </div>
  );
}
