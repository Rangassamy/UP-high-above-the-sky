from typing import Annotated
from fastapi import APIRouter, Cookie, Header, HTTPException
from pydantic import BaseModel
from starlette.status import HTTP_404_NOT_FOUND

from src.core.database.crud import products as crud
from src.core.security import get_current_user, is_admin
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


class ProductObjectWithId(BaseModel):
    id: str
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
    return [product.__dict__ for product in products]


@router.post("/product")
async def create(
    object: ProductObject,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
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


@router.post("/products")
async def create_multiples(
    objects: list[ProductObject],
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    for object in objects:
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


@router.delete("/product/{id}")
async def delete(
    id: str,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    product = crud.get(id)
    if product:
        crud.delete(id)
        return {"success": True}
    else:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Product not found")


@router.put("/products")
async def edit(
    objects: list[ProductObjectWithId],
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    products = []
    for object in objects:
        product = Product(
            object.id,
            object.slug,
            object.name,
            object.category,
            object.price,
            object.description,
            object.image,
            object.stock_quantity,
            object.featured,
        )
        products.append(product)
        if not crud.is_exist(product.id):
            raise HTTPException(
                status_code=HTTP_404_NOT_FOUND,
                detail=f"Product id {product.id} do not exist",
            )
    for product in products:
        crud.update(product)
    return {"success": True}
