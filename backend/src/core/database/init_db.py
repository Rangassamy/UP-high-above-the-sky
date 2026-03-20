"""Creation des tables et injection des donnees de demonstration."""

import shutil

from src.core.database.db import STORAGE_DIR, UPLOADS_DIR
from src.core.database.crud import carts, orders, products, promo_codes, users
from src.models.product import Product
from src.models.promo_code import PromoCode
from src.models.user import Role

DEMO_UPLOADS_DIR = UPLOADS_DIR / "demo"
DEMO_IMAGE_SOURCE = STORAGE_DIR.parent / "up-frontend" / "public" / "image.png"
DEFAULT_PRODUCT_IMAGE = "/uploads/demo/default-product.png"


DEMO_PRODUCTS = [
    Product(
        None,
        "casquette-white-cloud",
        "Casquette White Cloud",
        "caps",
        39,
        "Casquette blanche a visiere courbe, broderie UP ton sur ton et coton epais pour un usage quotidien.",
        "/uploads/demo/casquette-white-cloud.png",
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
        "/uploads/demo/casquette-storm-grey.png",
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
        "/uploads/demo/casquette-sunset-line.png",
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
        "/uploads/demo/hoodie-cloud.png",
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
        "/uploads/demo/sweat-altitude-crew.png",
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
        "/uploads/demo/chaussettes-contrail-pack.png",
        30,
        False,
    ),
]

DEMO_PROMOS = [
    PromoCode(None, "UP10", "PERCENT", 10, True),
    PromoCode(None, "WELCOME5", "AMOUNT", 5, True),
]


def seed_admin():
    """Cree ou remet a niveau le compte administrateur de demonstration."""
    admin = users.get_user_by_name("admin@up.local")
    if admin:
        if admin.role != Role.ADMIN:
            admin.role = Role.ADMIN
            users.update_user(admin)
        return

    admin = users.create_user("admin@up.local", "admin@up.local", "admin")
    admin.role = Role.ADMIN
    users.update_user(admin)


def prepare_demo_images():
    """Cree les images locales de demonstration a partir de l'image du projet."""
    DEMO_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    if not DEMO_IMAGE_SOURCE.exists():
        return

    targets = {DEFAULT_PRODUCT_IMAGE.removeprefix("/uploads/demo/")}
    targets.update(f"{product.slug}.png" for product in DEMO_PRODUCTS)

    for filename in targets:
        target = DEMO_UPLOADS_DIR / filename
        if not target.exists():
            shutil.copyfile(DEMO_IMAGE_SOURCE, target)


def migrate_remote_product_images():
    """Remplace les anciennes URL distantes par des images locales du projet."""
    placeholder = DEMO_UPLOADS_DIR / "default-product.png"
    if not placeholder.exists():
        return

    product_uploads_dir = UPLOADS_DIR / "products"
    product_uploads_dir.mkdir(parents=True, exist_ok=True)

    for product in products.get_all():
        image = str(product.image or "").strip().lower()
        if not image.startswith(("http://", "https://")):
            continue

        filename = f"{product.slug or 'product'}-local.png"
        target = product_uploads_dir / filename
        if not target.exists():
            shutil.copyfile(placeholder, target)

        product.image = f"/uploads/products/{filename}"
        products.update(product)


def seed_products():
    """Ajoute les produits de demonstration uniquement lors de la premiere initialisation."""
    if products.get_all():
        return

    for product in DEMO_PRODUCTS:
        products.create(product)


def seed_promos():
    """Ajoute les codes promo de demonstration ou met a jour leur version existante."""
    for promo_code in DEMO_PROMOS:
        existing = promo_codes.get_by_code(promo_code.code)
        if existing:
            promo_code.id = existing.id
            promo_codes.update(promo_code)
        else:
            promo_codes.create(promo_code)


def init():
    """Prepare toute la base SQLite au demarrage de l'application."""
    users.create_table()
    products.create_table()
    promo_codes.create_table()
    carts.create_table()
    orders.create_table()
    prepare_demo_images()
    seed_admin()
    seed_products()
    migrate_remote_product_images()
    seed_promos()
    print("Created all databases")
