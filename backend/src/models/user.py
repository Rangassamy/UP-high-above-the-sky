"""Modeles lies aux utilisateurs et a leurs roles."""

from enum import Enum
from typing import Optional


class Role(Enum):
    """Roles disponibles dans l'application."""

    USER = "user"
    ADMIN = "admin"


def get_role_from_string(role_name: str) -> Role:
    """Convertit une chaine lue en base en enum Role."""
    role_dict = {role.value: role for role in Role}
    return role_dict.get(role_name) or get_default_role()


def get_default_role() -> Role:
    """Role attribue par defaut a tout nouveau compte."""
    return Role.USER


class User:
    """Represente un utilisateur tel qu'il est stocke dans SQLite."""

    def __init__(self, id: str, username: str, role: Role, email: str, password: str):
        self.id = id
        self.username = username
        self.role = role
        self.email = email
        self.password = password
