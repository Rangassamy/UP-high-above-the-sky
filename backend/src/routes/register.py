from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

from src.core import security
from src.core.database.crud import users
from src.models.user import User


class RegisterForm(BaseModel):
    username: str
    email: str
    password: str


router = APIRouter()


@router.post("/register")
async def register(form: RegisterForm, response: Response):
    user = users.get_user_by_name(form.username)
    if user:
        raise HTTPException(status_code=400, detail="Username alreay exist")
    users.create_user(form.username, form.email, form.password)
    user = users.get_user_by_name(form.username)
    token = security.create_token({"sub": str(user.id)})
    res_token = security.TokenResponse(access_token=token, token_type="bearer")
    response.set_cookie("access_token", token, httponly=True, samesite="lax")
    return res_token
