FROM node:22-alpine as base

WORKDIR /app

# Installation des dependances Node du frontend.
COPY package*.json .
RUN npm install

# Copie du code React/Vite.
COPY . .

EXPOSE 5173

# Lancement du serveur Vite en mode developpement.
CMD ["npm","run","dev"]
