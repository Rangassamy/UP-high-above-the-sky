from typing import Annotated
from src.core.database.crud import carts as crud, products
from fastapi import APIRouter, Cookie, Header, HTTPException, status

from src.core.security import get_current_user
from src.models.cart import Cart
from src.models.user import User

router = APIRouter()


@router.get("/carts")
async def get_all(
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user: User = await get_current_user(access_token or authorization)
    carts = crud.get_all(user.id)
    return carts


@router.post("/cart")
async def add(
    product_id: int,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
    quantity: int = 1,
):
    user: User = await get_current_user(access_token or authorization)
    if not products.get(product_id):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"product id {product_id} do not exist"
        )
    if quantity <= 0:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "quantity must be more than 0")

    cart = crud.get_by_product(product_id, user.id)
    if cart:
        cart.quantity = quantity
        crud.update(cart)
        return {"success": True}

    cart = Cart(product_id, quantity, user.id)
    crud.create(cart)
    return {"success": True}


@router.delete("/cart/{product_id}")
async def remove(
    product_id: int,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user: User = await get_current_user(access_token or authorization)
    if not crud.get_by_product(product_id, user.id):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"cart id {product_id} do not exist"
        )
    crud.delete_by_product(product_id, user.id)
    return {"success": True}


@router.delete("/carts")
async def clear(
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user: User = await get_current_user(access_token or authorization)
    crud.clear_by_user(user.id)
    return {"success": True}
