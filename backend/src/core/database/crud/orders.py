from datetime import datetime
from typing import List, Optional
import json
from src.core.database.db import connection
from src.models.order import Order
from src.core.utils import generate_order_id


def create_table():
    cur = connection.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY NOT NULL,
        user_id INTEGER NOT NULL,
        created_date INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT NOT NULL,
        name TEXT,
        email TEXT,
        address1 TEXT,
        city TEXT,
        zip TEXT,
        promo_id TEXT,
        items_json TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)
    connection.commit()

    # Backward-compat: add missing columns if table already existed
    cur.execute("PRAGMA table_info(orders);")
    existing = {row[1] for row in cur.fetchall()}
    columns = {
        "name": "TEXT",
        "email": "TEXT",
        "address1": "TEXT",
        "city": "TEXT",
        "zip": "TEXT",
        "promo_id": "TEXT",
        "items_json": "TEXT",
    }
    for col, typ in columns.items():
        if col not in existing:
            cur.execute(f"ALTER TABLE orders ADD COLUMN {col} {typ};")
    connection.commit()


def create(order: Order):
    cur = connection.cursor()
    id = generate_order_id()
    order.id = id
    cur.execute(
        """
        INSERT INTO orders (id, user_id, created_date, total_price, status, name, email, address1, city, zip, promo_id, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """,
        (
            id,
            order.user_id,
            order.created_date.timestamp(),
            order.total_price,
            order.status,
            order.name,
            order.email,
            order.address1,
            order.city,
            order.zip,
            order.promo_id,
            json.dumps(order.items or []),
        ),
    )
    connection.commit()
    return order


def get(id: str) -> Optional[Order]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM orders WHERE id = ?;", (id,))
    row = cur.fetchone()
    if row:
        return Order(
            id=row[0],
            user_id=row[1],
            created_date=datetime.fromtimestamp(row[2]),
            total_price=row[3],
            status=row[4],
            name=row[5] if len(row) > 5 else None,
            email=row[6] if len(row) > 6 else None,
            address1=row[7] if len(row) > 7 else None,
            city=row[8] if len(row) > 8 else None,
            zip=row[9] if len(row) > 9 else None,
            promo_id=row[10] if len(row) > 10 else None,
            items=json.loads(row[11]) if len(row) > 11 and row[11] else [],
        )
    return None


def get_all() -> List[Order]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM orders;")
    rows = cur.fetchall()
    return [
        Order(
            id=row[0],
            user_id=row[1],
            created_date=datetime.fromtimestamp(row[2]),
            total_price=row[3],
            status=row[4],
            name=row[5] if len(row) > 5 else None,
            email=row[6] if len(row) > 6 else None,
            address1=row[7] if len(row) > 7 else None,
            city=row[8] if len(row) > 8 else None,
            zip=row[9] if len(row) > 9 else None,
            promo_id=row[10] if len(row) > 10 else None,
            items=json.loads(row[11]) if len(row) > 11 and row[11] else [],
        )
        for row in rows
    ]


def get_all_by_user_id(user_id) -> List[Order]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM orders WHERE user_id = ?;", (user_id,))
    rows = cur.fetchall()
    return [
        Order(
            id=row[0],
            user_id=row[1],
            created_date=datetime.fromtimestamp(row[2]),
            total_price=row[3],
            status=row[4],
            name=row[5] if len(row) > 5 else None,
            email=row[6] if len(row) > 6 else None,
            address1=row[7] if len(row) > 7 else None,
            city=row[8] if len(row) > 8 else None,
            zip=row[9] if len(row) > 9 else None,
            promo_id=row[10] if len(row) > 10 else None,
            items=json.loads(row[11]) if len(row) > 11 and row[11] else [],
        )
        for row in rows
    ]


def update(order: Order):
    cur = connection.cursor()
    cur.execute(
        """
        UPDATE orders
        SET created_date = ?, total_price = ?, status = ?, name = ?, email = ?, address1 = ?, city = ?, zip = ?, promo_id = ?, items_json = ?
        WHERE id = ?;
        """,
        (
            order.created_date.timestamp(),
            order.total_price,
            order.status,
            order.name,
            order.email,
            order.address1,
            order.city,
            order.zip,
            order.promo_id,
            json.dumps(order.items or []),
            order.id,
        ),
    )
    connection.commit()


def delete(id: str):
    cur = connection.cursor()
    cur.execute("DELETE FROM orders WHERE id = ?;", (id,))
    connection.commit()
