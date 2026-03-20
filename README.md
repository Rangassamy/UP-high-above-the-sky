# UP - High Above the Sky

UP est un site e-commerce fictif compose d'un frontend React/Vite et d'un backend FastAPI avec stockage SQLite. Le depot contient une vraie separation entre l'interface client (`up-frontend/`) et l'API Python (`backend/`), avec une base locale conservee dans `storage/data.db`.

## Fonctionnalites

Le code actuel permet de :

- afficher une page d'accueil avec un produit mis en avant
- parcourir un catalogue de produits
- filtrer les produits par categorie, recherche, stock et prix
- consulter une fiche produit
- creer un compte et se connecter
- gerer un panier cote serveur pour les utilisateurs connectes
- valider une commande via un paiement simule
- appliquer un code promo au checkout
- consulter ses commandes dans l'espace compte
- envoyer un message via la page contact
- acceder a une interface d'administration pour gerer produits, commandes et codes promo
- importer des images produit en PNG depuis l'ordinateur de l'administrateur

Le backend initialise automatiquement les tables SQLite au demarrage et injecte, si besoin, un compte administrateur de demo, des produits par defaut et les codes promo `UP10` et `WELCOME5`.

## Structure du depot

```text
.
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── src/
│       ├── main.py
│       ├── core/
│       │   ├── database/
│       │   ├── security.py
│       │   └── utils.py
│       ├── models/
│       └── routes/
├── up-frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── stores/
│       ├── ui/
│       └── main.jsx
├── storage/
│   └── data.db
├── docker-compose.yml
├── requirements.txt
├── presentation.md
└── licence.txt
```

## Technologies utilisees

- Frontend : React 19, React DOM, React Router DOM, Zustand, Vite, ESLint
- Backend : FastAPI, PyJWT
- Base de donnees : SQLite
- Conteneurisation fournie dans le depot : Docker Compose + un Dockerfile pour le backend et un Dockerfile pour le frontend

## Prerequis

- Python 3.10 recommande
- Node.js 22 recommande
- `pip`
- `npm`
- Docker et Docker Compose si vous choisissez le lancement conteneurise

## Methode 1 - Lancement avec Docker

Le depot contient un `docker-compose.yml` ainsi qu'un `Dockerfile` pour le backend et un autre pour le frontend. Une fois Docker installe et actif, lancez l'ensemble du projet depuis la racine :

```bash
docker compose up --build
```

Services attendus :

- frontend : `http://localhost:5173`
- backend : `http://localhost:8000`
- documentation API : `http://localhost:8000/docs`

## Methode 2 - Lancement local sans Docker

Cette methode permet de lancer separement le backend Python et le frontend React.

### 1. Installer les dependances Python

Depuis la racine du projet :

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Lancer le backend

Dans un premier terminal, depuis la racine du projet :

```bash
source .venv/bin/activate
cd backend
fastapi run src/main.py
```

Le backend demarre sur :

- API : `http://localhost:8000`
- documentation FastAPI : `http://localhost:8000/docs`

### 3. Installer les dependances du frontend

Dans un second terminal :

```bash
cd up-frontend
npm ci
```

### 4. Lancer le frontend

Toujours dans `up-frontend/` :

```bash
npm run dev
```

Le frontend demarre sur :

- interface web : `http://localhost:5173`

Par defaut, le frontend pointe vers `http://localhost:8000` via `VITE_API_URL`, donc aucune configuration supplementaire n'est necessaire pour un lancement local standard.

## Commandes exactes a executer apres recuperation du code

Terminal 1 :

```bash
cd "<dossier-du-projet>"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd backend
fastapi run src/main.py
```

Terminal 2 :

```bash
cd "<dossier-du-projet>/up-frontend"
npm ci
npm run dev
```

Ensuite, ouvrir `http://localhost:5173`.

## Donnees de demo

Le code du backend cree ou met a jour des donnees de demo au demarrage :

- compte administrateur : `admin@up.local`
- mot de passe administrateur : `admin`
- codes promo : `UP10` et `WELCOME5`

La base SQLite est stockee dans `storage/data.db`.
Les images produit locales sont stockees dans `storage/uploads/`.

## Variables d'environnement cote frontend

Le frontend peut lire ces variables :

- `VITE_API_URL` : URL de l'API, par defaut `http://localhost:8000`
- `VITE_AUTH_MODE` : mode d'authentification, par defaut `both`
- `VITE_PROMO_VALIDATE_PATH` : route de validation des promos, par defaut `/code/check`

## Commandes utiles

Dans `up-frontend/` :

```bash
npm run build
npm run lint
```

## A retenir

- Le depot contient `docker-compose.yml`, `backend/Dockerfile` et `up-frontend/Dockerfile`.
- Le paiement reste volontairement simule dans le code.
- Le projet ne contient pas de suite de tests automatisee.
