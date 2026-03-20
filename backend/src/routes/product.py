"""Routes publiques et administratives des produits."""

import re
import unicodedata
from pathlib import Path
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Cookie, File, Header, HTTPException, UploadFile
from pydantic import BaseModel
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.core.database.db import UPLOADS_DIR
from src.core.database.crud import products as crud
from src.core.security import get_current_user, is_admin
from src.models.product import Product

PRODUCT_UPLOADS_DIR = UPLOADS_DIR / "products"
PRODUCT_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


class ProductObject(BaseModel):
    """Format de creation d'un produit depuis l'interface d'administration."""

    slug: str
    name: str
    category: str
    price: float
    description: str
    image: str
    stock_quantity: int
    featured: bool


class ProductObjectWithId(BaseModel):
    """Format de mise a jour d'un produit existant."""

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


def make_upload_name(filename: str | None) -> str:
    """Construit un nom de fichier propre et unique pour une image PNG."""
    stem = Path(filename or "image").stem
    normalized = unicodedata.normalize("NFD", stem)
    normalized = normalized.encode("ascii", "ignore").decode("ascii")
    normalized = re.sub(r"[^a-zA-Z0-9]+", "-", normalized).strip("-").lower()
    normalized = normalized or "image"
    return f"{normalized}-{uuid4().hex[:8]}.png"


def remove_project_image(image_path: str | None):
    """Supprime une image locale de produit si elle appartient au dossier d'upload."""
    raw = str(image_path or "").strip()
    if not raw.startswith("/uploads/products/"):
        return

    file_path = UPLOADS_DIR / raw.removeprefix("/uploads/")
    if file_path.exists():
        file_path.unlink()


@router.get("/products")
async def get_products():
    """Expose la liste complete des produits du catalogue."""
    products = crud.get_all()
    return [product.__dict__ for product in products]


@router.post("/product/image")
async def upload_product_image(
    image: UploadFile = File(...),
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    """Stocke une image PNG locale dans le projet pour un produit."""
    user = await get_current_user(access_token or authorization)
    await is_admin(user)

    filename = image.filename or ""
    content_type = image.content_type or ""
    if not filename.lower().endswith(".png") or content_type not in {
        "image/png",
        "image/x-png",
    }:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="Only PNG images are allowed",
        )

    content = await image.read()
    if not content.startswith(b"\x89PNG\r\n\x1a\n"):
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="Invalid PNG file",
        )

    upload_name = make_upload_name(filename)
    destination = PRODUCT_UPLOADS_DIR / upload_name
    destination.write_bytes(content)

    return {"success": True, "path": f"/uploads/products/{upload_name}"}


@router.post("/product")
async def create(
    object: ProductObject,
    access_token: Annotated[str | None, Cookie()] = None,
    authorization: Annotated[str | None, Header()] = None,
):
    """Cree un nouveau produit. Route reservee a l'administration."""
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
    """Cree plusieurs produits d'un coup. Route reservee a l'administration."""
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
    """Supprime un produit du catalogue. Route reservee a l'administration."""
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    product = crud.get(id)
    if product:
        remove_project_image(product.image)
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
    """Met a jour une liste de produits. Route reservee a l'administration."""
    user = await get_current_user(access_token or authorization)
    await is_admin(user)
    products = []
    for object in objects:
        existing_product = crud.get(object.id)
        if existing_product is None:
            raise HTTPException(
                status_code=HTTP_404_NOT_FOUND,
                detail=f"Product id {object.id} do not exist",
            )
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
        if existing_product.image != product.image:
            remove_project_image(existing_product.image)
    for product in products:
        crud.update(product)
    return {"success": True}
