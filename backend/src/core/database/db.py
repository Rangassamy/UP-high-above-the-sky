import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
if BASE_DIR.name == "backend":
    STORAGE_DIR = BASE_DIR.parent / "storage"
else:
    STORAGE_DIR = BASE_DIR / "storage"

STORAGE_DIR.mkdir(parents=True, exist_ok=True)

connection = sqlite3.connect(STORAGE_DIR / "data.db", check_same_thread=False)
