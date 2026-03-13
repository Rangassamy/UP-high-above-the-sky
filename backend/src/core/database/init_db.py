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
        "Casquette blanche a visiere courbe, broderie UP ton sur ton et coton epais pour un usage quotidien.",
        "https://via.placeholder.com/1200x800/F4F1EA/1E293B?text=UP+White+Cloud",
        25,
        True,
    ),
    Product(
        None,
        "casquette-storm-grey",
        "Casquette Storm Grey",
        "caps",
        39,
        "Version gris orage avec fermeture ajustable et interieur renforce pour garder une belle tenue.",
        "https://via.placeholder.com/1200x800/E5E7EB/1F2937?text=UP+Storm+Grey",
        12,
        False,
    ),
    Product(
        None,
        "casquette-sunset-line",
        "Casquette Sunset Line",
        "caps",
        42,
        "Modele beige sable avec surpiqures orange et finition plus sport, pense pour les sorties en ville.",
        "https://via.placeholder.com/1200x800/FDE7C7/7C2D12?text=UP+Sunset+Line",
        9,
        False,
    ),
    Product(
        None,
        "hoodie-cloud",
        "Hoodie Cloud",
        "vetements",
        79,
        "Hoodie coupe droite, interieur molletonne et logo poitrine discret. Piece phare de la collection.",
        "https://via.placeholder.com/1200x800/DBEAFE/1D4ED8?text=UP+Hoodie+Cloud",
        8,
        False,
    ),
    Product(
        None,
        "sweat-altitude-crew",
        "Sweat Altitude Crew",
        "vetements",
        69,
        "Sweat col rond bleu nuit, confortable et facile a porter avec un jean ou un pantalon cargo.",
        "https://via.placeholder.com/1200x800/DBEAFE/172554?text=UP+Altitude+Crew",
        14,
        False,
    ),
    Product(
        None,
        "chaussettes-contrail-pack",
        "Pack Chaussettes Contrail",
        "vetements",
        19,
        "Lot de trois paires en coton souple, logo tisse et maintien elastique simple pour tous les jours.",
        "https://via.placeholder.com/1200x800/F8FAFC/334155?text=UP+Contrail+Pack",
        30,
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
    existing_by_slug = {product.slug: product for product in products.get_all()}
    for product in DEMO_PRODUCTS:
        existing = existing_by_slug.get(product.slug)
        if existing:
            product.id = existing.id
            products.update(product)
        else:
            products.create(product)


def seed_promos():
    for promo_code in DEMO_PROMOS:
        existing = promo_codes.get_by_code(promo_code.code)
        if existing:
            promo_code.id = existing.id
            promo_codes.update(promo_code)
        else:
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
