from typing import Annotated
from fastapi import APIRouter, Cookie, Header, HTTPException
from pydantic import BaseModel
from starlette.status import HTTP_404_NOT_FOUND
from src.core.database.crud import promo_codes as crud
from src.core.security import get_current_user, is_admin
from src.models.promo_code import PromoCode


class PromoCodeObject(BaseModel):
    code: str
    type: str
    value: int
    enable: bool


router = APIRouter()


@router.get("/code/check/{name}")
async def check(name: str):
    promo_code = crud.get_by_code(name)
    if promo_code and promo_code.enable:
        return {"success": True, "content": promo_code}
    else:
        return {"success": False, "content": {}}


@router.get("/codes")
async def get_all(
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)

    promo_codes = crud.get_all()
    return promo_codes


@router.post("/code")
async def create(
    object: PromoCodeObject,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    promo_code = PromoCode(None, object.code, object.type, object.value, object.enable)
    crud.create(promo_code)
    return {"success": True}


@router.put("/code/{id}")
async def edit(
    id: str,
    object: PromoCodeObject,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    if crud.get(id) is None:
        raise HTTPException(HTTP_404_NOT_FOUND, f"Code id {id} do not exist")
    promo_code = PromoCode(id, object.code, object.type, object.value, object.enable)
    crud.update(promo_code)
    return {"success": True}


@router.delete("/code/{id}")
async def delete(
    id: str,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    promo_code = crud.get(id)
    if not promo_code:
        raise HTTPException(HTTP_404_NOT_FOUND, f"Code id {id} do not exist")
    crud.delete(id)
    return {"success": True}
