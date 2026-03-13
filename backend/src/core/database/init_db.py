from src.core.database.crud import carts, orders, products, promo_codes, users
from src.models.product import Product
from src.models.promo_code import PromoCode
from src.models.user import Role


DEMO_PRODUCTS = [
    Product(
        None,
        "casquette-white-cloud",
        "Casquette White Cloud",
        "caps",
        39,
        "Casquette blanche premium. Minimal, propre.",
        "https://via.placeholder.com/1200x800?text=UP+White+Cap",
        25,
        True,
    ),
    Product(
        None,
        "casquette-storm-grey",
        "Casquette Storm Grey",
        "caps",
        39,
        "Variante grise. Meme coupe, meme qualite.",
        "https://via.placeholder.com/1200x800?text=UP+Storm+Cap",
        12,
        False,
    ),
    Product(
        None,
        "hoodie-cloud",
        "Hoodie Cloud",
        "vetements",
        79,
        "Hoodie nuage. Serie limitee.",
        "https://via.placeholder.com/1200x800?text=UP+Hoodie",
        8,
        False,
    ),
]

DEMO_PROMOS = [
    PromoCode(None, "UP10", "PERCENT", 10, True),
    PromoCode(None, "WELCOME5", "AMOUNT", 5, True),
]


def seed_admin():
    admin = users.get_user_by_name("admin@up.local")
    if admin:
        if admin.role != Role.ADMIN:
            admin.role = Role.ADMIN
            users.update_user(admin)
        return

    admin = users.create_user("admin@up.local", "admin@up.local", "admin")
    admin.role = Role.ADMIN
    users.update_user(admin)


def seed_products():
    if products.get_all():
        return
    for product in DEMO_PRODUCTS:
        products.create(product)


def seed_promos():
    if promo_codes.get_all():
        return
    for promo_code in DEMO_PROMOS:
        promo_codes.create(promo_code)


def init():
    users.create_table()
    products.create_table()
    promo_codes.create_table()
    carts.create_table()
    orders.create_table()
    seed_admin()
    seed_products()
    seed_promos()
    print("Created all databases")
