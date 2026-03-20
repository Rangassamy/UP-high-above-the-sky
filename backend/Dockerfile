FROM python:3.10

ENV PYTHONUNBUFFERED=1

WORKDIR /app/

# Installation des dependances Python du backend.
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source puis preparation du dossier de stockage SQLite.
COPY ./src /app/src

RUN mkdir -p /app/storage

COPY . /app

# Lancement du serveur FastAPI sur le point d'entree du projet.
CMD ["fastapi", "run", "src/main.py"]
