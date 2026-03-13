import SectionTitle from "../../components/SectionTitle";

export default function MentionsPage(){
  return (
    <div className="col" style={{ maxWidth: 900 }}>
      <SectionTitle
        title="Mentions légales"
        subtitle="Informations fictives adaptees a une presentation scolaire."
      />
      <div className="glass card col">
        <div>
          <strong>Editeur</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            UP - High Above the Sky, projet realise dans le cadre du Trophée NSI.
          </div>
        </div>

        <div>
          <strong>Equipe</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Le site est concu a trois : backend, frontend et contenu produit.
          </div>
        </div>

        <div>
          <strong>Hebergement</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            La boutique est hebergee localement pour la demonstration et ne
            correspond pas a un commerce reel.
          </div>
        </div>

        <div>
          <strong>Contact</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Adresse fictive : contact@up-high-sky.fr
          </div>
        </div>
      </div>
    </div>
  );
}
