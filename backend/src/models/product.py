"""Modele Python d'un produit du catalogue."""

from typing import Optional


class Product:
    """Represente un produit editable depuis l'interface d'administration."""

    def __init__(
        self,
        id: Optional[str],
        slug: str,
        name: str,
        category: str,
        price: float,
        description: str,
        image: str,
        stock_quantity: int,
        featured: bool,
    ):
        self.id = id or None
        self.slug = slug
        self.name = name
        self.category = category
        self.price = price
        self.description = description
        self.image = image
        self.stock_quantity = stock_quantity
        self.featured = featured
