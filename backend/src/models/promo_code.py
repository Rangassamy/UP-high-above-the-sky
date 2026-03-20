"""Modele Python d'un code promotionnel."""

from typing import Optional


class PromoCode:
    """Represente une reduction de type pourcentage ou montant fixe."""

    def __init__(
        self, id: Optional[str], code: str, code_type: str, value: int, enable: bool
    ):
        self.id = id
        self.code = code
        self.type = code_type
        self.value = value
        self.enable = enable
