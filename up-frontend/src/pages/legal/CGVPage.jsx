import SectionTitle from "../../components/SectionTitle";

export default function CGVPage(){
  return (
    <div className="col" style={{ maxWidth: 900 }}>
      <SectionTitle
        title="Conditions générales de vente"
        subtitle="Version fictive utilisee pour la presentation du projet."
      />
      <div className="glass card col">
        <div>
          <strong>Produits</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Les articles proposes sur UP sont disponibles dans la limite des
            stocks indiques sur chaque fiche produit.
          </div>
        </div>

        <div>
          <strong>Commande</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            La commande est enregistree apres validation du panier puis saisie
            des informations de livraison sur la page de paiement simule.
          </div>
        </div>

        <div>
          <strong>Livraison et retours</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Dans le cadre de ce projet scolaire, les livraisons et retours sont
            fictifs et servent uniquement a illustrer un parcours e-commerce.
          </div>
        </div>

        <div>
          <strong>Service client</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Toute question peut etre envoyee depuis la page de contact du site.
          </div>
        </div>
      </div>
    </div>
  );
}
