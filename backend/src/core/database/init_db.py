from src.core.database.crud import products, promo_codes, users, carts


def init():
    users.create_table()
    products.create_table()
    promo_codes.create_table()
    carts.create_table()
    print("Created all databases")
