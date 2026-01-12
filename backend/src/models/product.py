class Product:
    def __init__(
        self,
        id: str | None,
        slug: str,
        name: str,
        category: str,
        price: float,
        description: str,
        image: str,
        stock_quantity: int,
        featured: bool,
    ):
        self.id = id
        self.slug = slug
        self.name = name
        self.category = category
        self.price = price
        self.description = description
        self.image = image
        self.stock_quantity = stock_quantity
        self.featured = featured
