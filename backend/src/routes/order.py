from typing import Annotated
from fastapi import APIRouter, Cookie

from src.core.database.crud import orders as crud
from src.core.security import get_current_user, is_admin

router = APIRouter()


@router.get("/orders/me")
async def get_all_user_orders(access_token: Annotated[str | None, Cookie()]):
    user = await get_current_user(access_token)
    orders = crud.get_all_by_user_id(user.id)
    return orders


@router.get("/orders")
async def get_all(access_token: Annotated[str | None, Cookie()]):
    user = await get_current_user(access_token)
    await is_admin(user)
    orders = crud.get_all()
    return orders
