from src.core.database.db import connection
from src.models.product import Product
import logging

logger = logging.getLogger(__name__)


def create_table():
    cur = connection.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        image TEXT,
        stock_quantity INTEGER NOT NULL,
        featured BOOLEAN NOT NULL
        );
    """)
    connection.commit()


def create(product: Product):
    cur = connection.cursor()
    cur.execute(
        """
        INSERT INTO products (slug, name, category, price, description, image, stock_quantity, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """,
        (
            product.slug,
            product.name,
            product.category,
            product.price,
            product.description,
            product.image,
            product.stock_quantity,
            product.featured,
        ),
    )
    connection.commit()


def get(product_id):
    cur = connection.cursor()
    cur.execute(
        """
        SELECT * FROM products WHERE id = ?
    """,
        (product_id,),
    )
    result = cur.fetchone()
    if result:
        return Product(*result)
    else:
        return None


def get_all() -> list[Product]:
    cur = connection.cursor()
    cur.execute("SELECT * FROM products")
    result = cur.fetchall()
    if result:
        return [Product(*row) for row in result]
    else:
        return []


def update(product: Product):
    cur = connection.cursor()
    cur.execute(
        """
        UPDATE products SET slug = ?, name = ?, category = ?, price = ?, description = ?, image = ?, stock_quantity = ?, featured = ?
        WHERE id = ?
    """,
        (
            product.slug,
            product.name,
            product.category,
            product.price,
            product.description,
            product.image,
            product.stock_quantity,
            product.featured,
            product.id,
        ),
    )
    connection.commit()


def delete(id):
    cur = connection.cursor()
    cur.execute(
        """
        DELETE FROM products WHERE id = ?
    """,
        (id,),
    )
    connection.commit()
