from datetime import datetime
from typing import Annotated, Optional

from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from src.core.database.crud import carts as db_carts, orders
from src.core.database.crud import products as db_products
from src.core.database.crud import promo_codes as db_promo
from fastapi import APIRouter, Body, Cookie, Header, HTTPException
from pydantic import BaseModel

from src.core.security import get_current_user
from src.models.order import Order
from src.models.user import User

router = APIRouter()


class BuyPayload(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    address1: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None


@router.post("/buy")
async def buy(
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
    promo_id: Optional[str] = None,
    payload: BuyPayload = Body(default=BuyPayload()),
):
    user: User = await get_current_user(access_token or authorization)
    cart = db_carts.get_by_user(user.id)
    total_price = 0.0
    if len(cart) == 0:
        raise HTTPException(HTTP_404_NOT_FOUND, "There are no items in your cart")
    line_items = []
    for e in cart:
        product = db_products.get(e.product_id)
        if not product:
            raise HTTPException(HTTP_404_NOT_FOUND, "Product in cart not found")
        line_total = product.price * e.quantity
        total_price += line_total
        line_items.append(
            {
                "product_id": e.product_id,
                "qty": e.quantity,
                "name": product.name,
                "price": product.price,
                "line_total": line_total,
            }
        )
    if promo_id:
        promo = db_promo.get(promo_id)
        if not promo or not promo.enable:
            raise HTTPException(HTTP_404_NOT_FOUND, "Invalid promo code")
        match promo.type:
            case "AMOUNT":
                total_price -= promo.value
            case "PERCENT":
                total_price = total_price * (100 - promo.value) / 100
            case _:
                raise HTTPException(
                    HTTP_400_BAD_REQUEST, f"Unhandled promo code with type {promo.type}"
                )
    total_price = max(total_price, 0)
    order = orders.create(
        Order(
            None,
            user.id,
            datetime.now(),
            total_price,
            "EN_PREPARATION",
            payload.name,
            payload.email,
            payload.address1,
            payload.city,
            payload.zip,
            promo_id,
            line_items,
        )
    )
    db_carts.clear_by_user(user.id)
    return {"success": True, "order": order.__dict__}
