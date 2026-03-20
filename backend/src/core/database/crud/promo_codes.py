"""Operations SQLite liees aux codes promotionnels."""

from typing import List, Optional
from src.core.database.db import connection
from src.models.promo_code import PromoCode


def create_table():
    """Cree la table des codes promo si elle n'existe pas."""
    cur = connection.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS promo_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        type TEXT NOT NULL,
        value INTEGER NOT NULL,
        enable BOOLEAN NOT NULL
        );
    """)
    connection.commit()


def create(promo_code: PromoCode):
    """Ajoute un nouveau code promotionnel."""
    cur = connection.cursor()
    cur.execute(
        """
        INSERT INTO promo_codes (code, type, value, enable)
        VALUES (?, ?, ?, ?);
    """,
        (promo_code.code, promo_code.type, promo_code.value, promo_code.enable),
    )
    connection.commit()


def get(id: str) -> Optional[PromoCode]:
    """Recupere un code promo par identifiant."""
    cur = connection.cursor()
    cur.execute("SELECT * FROM promo_codes WHERE id = ?;", (id,))
    row = cur.fetchone()
    if row:
        return PromoCode(
            id=row[0], code=row[1], code_type=row[2], value=row[3], enable=row[4]
        )
    return None


def get_all() -> List[PromoCode]:
    """Retourne tous les codes promo pour l'administration."""
    cur = connection.cursor()
    cur.execute("SELECT * FROM promo_codes;")
    rows = cur.fetchall()
    return [
        PromoCode(id=row[0], code=row[1], code_type=row[2], value=row[3], enable=row[4])
        for row in rows
    ]


def get_by_code(code: str) -> Optional[PromoCode]:
    """Recherche un code promo a partir de son texte."""
    cur = connection.cursor()
    cur.execute("SELECT * FROM promo_codes WHERE code = ?;", (code,))
    row = cur.fetchone()
    if row:
        return PromoCode(
            id=row[0], code=row[1], code_type=row[2], value=row[3], enable=row[4]
        )
    return None


def update(promo_code: PromoCode):
    """Met a jour un code promotionnel existant."""
    cur = connection.cursor()
    cur.execute(
        """
        UPDATE promo_codes
        SET code = ?, type = ?, value = ?, enable = ?
        WHERE id = ?;
    """,
        (
            promo_code.code,
            promo_code.type,
            promo_code.value,
            promo_code.enable,
            promo_code.id,
        ),
    )
    connection.commit()


def delete(id: str):
    """Supprime un code promo."""
    cur = connection.cursor()
    cur.execute(
        """
        DELETE FROM promo_codes WHERE id = ?;
    """,
        (id,),
    )
    connection.commit()
