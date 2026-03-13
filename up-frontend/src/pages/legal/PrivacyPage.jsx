import SectionTitle from "../../components/SectionTitle";

export default function PrivacyPage(){
  return (
    <div className="col" style={{ maxWidth: 900 }}>
      <SectionTitle
        title="Politique de confidentialité"
        subtitle="Resume fictif du traitement des donnees pour ce projet."
      />
      <div className="glass card col">
        <div>
          <strong>Donnees collectees</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Le site enregistre les informations liees au compte, au panier et a
            la commande : identifiant, email, adresse et contenu de commande.
          </div>
        </div>

        <div>
          <strong>Utilisation</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Ces donnees servent uniquement a faire fonctionner la boutique dans
            le cadre de la demonstration technique.
          </div>
        </div>

        <div>
          <strong>Conservation</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Les informations restent stockees localement dans la base SQLite du
            projet tant que celle-ci n'est pas reinitialisee.
          </div>
        </div>

        <div>
          <strong>Droits</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Dans un contexte reel, l'utilisateur pourrait demander la
            consultation, la correction ou la suppression de ses donnees.
          </div>
        </div>
      </div>
    </div>
  );
}
