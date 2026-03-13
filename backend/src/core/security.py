from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
import jwt
from pydantic import BaseModel

from src.core.database.crud.users import get_user
from src.models.user import Role, User


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"


def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


def normalize_token(token: str | None) -> str | None:
    if not token:
        return None
    if token.lower().startswith("bearer "):
        return token[7:]
    return token


async def get_current_user(token: str | None) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = normalize_token(token)
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except jwt.PyJWTError as exc:
        raise credentials_exception from exc
    if user_id is None:
        raise credentials_exception
    user = get_user(user_id)
    if user:
        return user
    else:
        raise credentials_exception


async def is_admin(user: User):
    if user.role.name == Role.ADMIN.name:
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You must be admin to access to this resource",
        headers={"WWW-Authenticate": "Bearer"},
    )
