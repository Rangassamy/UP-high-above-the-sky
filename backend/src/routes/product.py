import json
from fastapi import APIRouter
from pydantic import BaseModel

from src.core.database.crud import products as crud
from src.models.product import Product


class ProductObject(BaseModel):
    slug: str
    name: str
    category: str
    price: float
    description: str
    image: str
    stock_quantity: int
    featured: bool


router = APIRouter()


@router.get("/products")
async def get_products():
    products = crud.get_all()
    return [json.dumps(product.__dict__) for product in products]


@router.put("/product")
async def create(object: ProductObject):
    product = Product(
        None,
        object.slug,
        object.name,
        object.category,
        object.price,
        object.description,
        object.image,
        object.stock_quantity,
        object.featured,
    )
    crud.create(product)
    return {"success": True}
