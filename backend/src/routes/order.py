"""Routes de lecture et de gestion des commandes."""

from typing import Annotated
from fastapi import APIRouter, Cookie, Header, HTTPException
from pydantic import BaseModel

from src.core.database.crud import orders as crud
from src.core.security import get_current_user, is_admin

router = APIRouter()


class OrderStatusPayload(BaseModel):
    """Payload utilise par l'administration pour changer un statut."""

    status: str


@router.get("/orders/me")
async def get_all_user_orders(
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    """Retourne les commandes du compte connecte."""
    user = await get_current_user(access_token or authorization)
    orders = crud.get_all_by_user_id(user.id)
    return [o.__dict__ for o in orders]


@router.get("/orders")
async def get_all(
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    """Retourne toutes les commandes pour l'espace d'administration."""
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    orders = crud.get_all()
    return [o.__dict__ for o in orders]


@router.patch("/orders/{order_id}")
async def update_status(
    order_id: str,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
    payload: OrderStatusPayload = None,
):
    """Met a jour le statut d'une commande depuis l'administration."""
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    order = crud.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not payload.status:
        raise HTTPException(status_code=400, detail="Missing status")
    order.status = payload.status
    crud.update(order)
    return {"success": True}
