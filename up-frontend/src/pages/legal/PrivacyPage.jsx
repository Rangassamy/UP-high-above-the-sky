import SectionTitle from "../../components/SectionTitle";

export default function PrivacyPage(){
  return (
    <div className="col" style={{ maxWidth: 900 }}>
      <SectionTitle title="Politique de confidentialité" subtitle="Texte placeholder." />
      <div className="glass card">
        <div className="muted">
          Données collectées, cookies, durée de conservation, droits (RGPD), etc. (À écrire).
        </div>
      </div>
    </div>
  );
}
