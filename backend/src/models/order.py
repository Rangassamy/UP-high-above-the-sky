from datetime import datetime
from typing import Optional


class Order:
    def __init__(
        self,
        id: Optional[str],
        user_id: str,
        created_date: datetime,
        total_price: float,
        status: str,
        name: Optional[str] = None,
        email: Optional[str] = None,
        address1: Optional[str] = None,
        city: Optional[str] = None,
        zip: Optional[str] = None,
        promo_id: Optional[str] = None,
        items: Optional[list] = None,
    ):
        self.id = id
        self.user_id = user_id
        self.created_date = created_date
        self.total_price = total_price
        self.status = status
        self.name = name
        self.email = email
        self.address1 = address1
        self.city = city
        self.zip = zip
        self.promo_id = promo_id
        self.items = items or []
