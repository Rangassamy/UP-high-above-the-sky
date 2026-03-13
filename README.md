## Découvrir le projet

Bienvenue dans **UP - High Above the Sky**, une mini boutique en ligne de
vêtements et accessoires.

Le site sépare bien :

- un **frontend React/Vite**
- un **backend FastAPI**
- une **base SQLite**

## Fonctionnalités

### Mode utilisateur

- explorer les produits
- ajouter des articles au panier
- modifier le panier
- passer une commande avec paiement simulé
- retrouver ses commandes dans l'espace compte

### Mode administrateur

- ajouter, modifier ou supprimer des produits
- créer et gérer des codes promotionnels
- voir toutes les commandes
- changer le statut d'une commande

## Lancement

Depuis la racine du projet :

```bash
docker compose up
```

## Données de demo

Si la base est vide, le backend ajoute automatiquement :

- quelques produits
- deux codes promo (`UP10` et `WELCOME5`)
- un compte administrateur de demo

Compte admin :

- identifiant : `admin@up.local`
- mot de passe : `admin`
