from src.core.database.db import connection
from src.core.database.crud import products, users


def init():
    users.create_table()
    products.create_table()
    print("Created all databases")
