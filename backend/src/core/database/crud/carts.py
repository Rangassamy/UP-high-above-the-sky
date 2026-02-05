from typing import List, Optional
from src.core.database.db import connection
from src.models.cart import Cart


def create_table():
    cur = connection.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)
    connection.commit()


def create(cart: Cart):
    cur = connection.cursor()
    cur.execute(
        """
        INSERT INTO carts (product_id, quantity, user_id)
        VALUES (?, ?, ?);
        """,
        (cart.product_id, cart.quantity, cart.user_id),
    )
    connection.commit()


def get(id: int) -> Optional[Cart]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM carts WHERE id = ?;", (id,))
    row = cur.fetchone()
    if row:
        return Cart(product_id=row[1], quantity=row[2], user_id=row[3])
    return None


def get_by_product(product_id: int) -> Optional[Cart]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM carts WHERE product_id = ?;", (product_id,))
    row = cur.fetchone()
    if row:
        return Cart(product_id=row[1], quantity=row[2], user_id=row[3])
    return None


def get_all(user_id: int) -> List[Cart]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM carts WHERE user_id = ?;", (user_id,))
    rows = cur.fetchall()
    return [Cart(product_id=row[1], quantity=row[2], user_id=row[3]) for row in rows]


def get_by_user(user_id: str) -> List[Cart]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM carts WHERE user_id = ?;", (user_id,))
    rows = cur.fetchall()
    return [Cart(product_id=row[1], quantity=row[2], user_id=row[3]) for row in rows]


def update(cart: Cart):
    cur = connection.cursor()
    cur.execute(
        "UPDATE carts SET quantity = ? WHERE product_id = ?;",
        (cart.quantity, cart.product_id),
    )
    connection.commit()


def delete(id: int):
    cur = connection.cursor()
    cur.execute("DELETE FROM carts WHERE id = ?;", (id,))
    connection.commit()


def delete_by_product(id: int):
    cur = connection.cursor()
    cur.execute("DELETE FROM carts WHERE product_id = ?;", (id,))
    connection.commit()


def clear_by_user(user_id: int):
    cur = connection.cursor()
    cur.execute("DELETE * FROM carts WHERE user_id = ?;", (user_id,))
    connection.commit()
