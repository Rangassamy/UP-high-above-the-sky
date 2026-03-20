# Presentation du projet UP

## Identite du projet

**UP** est un site e-commerce fictif realise dans le cadre de la Terminale, specialite Mathematiques et NSI.

- Projet : site e-commerce "UP"
- Auteurs :
  - Nolane Delumeau
  - Enzo Rangassamy
  - Mathis
- Niveau : Terminale specialite Mathematiques et NSI

## Intention

Nous avons voulu creer un site e-commerce complet pour la marque UP. Le projet cherche a montrer a la fois une vraie structure technique et une vraie identite visuelle. L'objectif n'etait pas seulement d'afficher des pages, mais de construire un parcours coherent : catalogue, compte, panier, commande, promotions, contact et administration.

Le depot actuel confirme cette intention avec :

- un frontend React/Vite organise en pages, composants, stores et routes
- un backend FastAPI qui gere l'authentification, les produits, le panier, les commandes, les codes promo et le formulaire de contact
- une base SQLite locale pour conserver les utilisateurs, les produits, les paniers et les commandes

## Direction artistique

L'univers du projet reprend une ambiance nuageuse, aerienne, futuriste et epuree. La reference visuelle autour de la casquette blanche se retrouve bien dans l'identite du catalogue et dans les produits de demonstration, notamment avec la mise en avant de modeles de casquettes et d'un produit hero sur la page d'accueil.

La presentation visuelle repose sur plusieurs intentions :

- un univers inspire des nuages et de l'altitude
- une interface moderne, proche d'un logiciel, avec une lecture claire des actions
- un site tres visuel, avec peu de texte inutile
- des transitions et animations pensees pour rester fluides et non agressives
- une separation nette entre l'experience visuelle du site et sa structure technique interne

## Ce que montre la version actuelle

La version presente dans le depot permet concretement de :

- consulter une page d'accueil avec un produit mis en avant
- explorer un catalogue avec recherche, tri et filtres
- naviguer entre les categories `caps` et `vetements`
- consulter une fiche produit
- creer un compte, se connecter et acceder a son espace personnel
- gerer un panier cote serveur
- simuler un paiement et creer une commande
- tester des codes promo
- consulter ses commandes
- envoyer un message depuis la page de contact
- administrer produits, commandes et promotions depuis une interface dediee

Le paiement est volontairement simule, ce qui rend le projet plus simple a presenter tout en conservant une logique e-commerce complete.

## Architecture technique

Le projet repose sur une architecture separee en deux parties :

- **Frontend** : React 19, React Router, Zustand, Vite
- **Backend** : FastAPI et PyJWT
- **Base de donnees** : SQLite, stockee dans `storage/data.db`

Le frontend tourne sur le port `5173` et le backend sur le port `8000`. Cette separation rend le projet lisible, modulaire et facile a expliquer a l'oral.

## Repartition des roles

La repartition suivante correspond a l'organisation voulue pour le projet :

- **Nolane** : design, UI, assets, identite visuelle
- **Enzo** : front-end React, composants, navigation, animations, gestion des etats et integration front
- **Mathis** : back-end Python, API, base de donnees et logique serveur

Cette organisation se lit aussi dans la structure du depot :

- le frontend contient la navigation, les vues, les stores et l'experience utilisateur
- le backend centralise les routes, la securite, la persistence SQLite et la logique metier
- l'identite visuelle donne au projet une personnalite propre, distincte d'une simple demonstration technique

## Conclusion

UP est un projet scolaire qui cherche a relier deux dimensions :

- une base technique concrete, avec un vrai frontend, un vrai backend et une vraie persistence
- une direction artistique forte, inspiree des nuages, de la legerete et d'un univers visuel minimal et moderne

Le resultat est un site e-commerce fictif mais complet dans son parcours, pense autant pour etre montre que pour etre compris techniquement.
