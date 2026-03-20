"""Route de contact utilisee par le formulaire du frontend."""

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr


class ContactPayload(BaseModel):
    """Contenu du message envoye depuis la page contact."""

    name: str
    email: EmailStr
    subject: str
    message: str


router = APIRouter()


@router.post("/contact")
async def send_contact(payload: ContactPayload):
    """Confirme la reception du message sans l'envoyer vers un service externe."""
    return {"success": True, "received": payload.model_dump()}
