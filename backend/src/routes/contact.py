from fastapi import APIRouter
from pydantic import BaseModel, EmailStr


class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


router = APIRouter()


@router.post("/contact")
async def send_contact(payload: ContactPayload):
    # For now we just acknowledge receipt; this keeps the flow fully backend-backed.
    return {"success": True, "received": payload.model_dump()}
