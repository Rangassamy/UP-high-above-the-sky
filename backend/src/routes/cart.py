from typing import Annotated
from src.core.database.crud import carts as crud, products
from fastapi import APIRouter, Cookie, HTTPException, status

from src.core.security import get_current_user
from src.models.cart import Cart
from src.models.user import User

router = APIRouter()


@router.get("/carts")
async def get_all(access_token: Annotated[str | None, Cookie()]):
    user: User = await get_current_user(access_token)
    carts = crud.get_all(user.id)
    return carts


@router.post("/cart")
async def add(
    product_id: int, access_token: Annotated[str | None, Cookie()], quantity: int = 1
):
    user: User = await get_current_user(access_token)
    if not products.get(product_id):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"product id {product_id} do not exist"
        )
    cart = crud.get_by_product(product_id)
    if cart:
        if quantity:
            if quantity <= 0:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST, "quantity must me more than 0"
                )
            cart.quantity = quantity
            crud.update(cart)
            return {"success": True}
    else:
        cart = Cart(product_id, 1, user.id)
        crud.create(cart)
        return {"success": True}


@router.delete("/cart/{product_id}")
async def remove(product_id: int, access_token: Annotated[str | None, Cookie()]):
    user: User = await get_current_user(access_token)
    if not crud.get_by_product(product_id):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"cart id {product_id} do not exist"
        )
    crud.delete_by_product(product_id)
    return {"success": True}


@router.delete("/carts")
async def clear(access_token: Annotated[str | None, Cookie()]):
    user: User = await get_current_user(access_token)
    crud.clear_by_user(user.id)
    return {"success": True}
