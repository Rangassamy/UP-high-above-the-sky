"""Fonctions utilitaires partagees par le backend."""

import random


def generate_order_id():
    """Genere un identifiant de commande lisible de type ORD-XXXXXXXX."""
    return "ORD-" + hex(random.randint(0, 0xFFFFFFFF))[2:10].upper()
