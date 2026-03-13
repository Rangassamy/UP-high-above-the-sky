from typing import Optional
from src.models.user import User, get_default_role, get_role_from_string
from src.core.database.db import connection


def create_table():
    cur = connection.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    connection.commit()


def create_user(username, email, password) -> User:
    with connection:
        query = connection.cursor()
        query.execute(
            """
            INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)
        """,
            (username, email, password, get_default_role().value),
        )
        user = get_user_by_name(username)
        if user is None:
            raise Exception("User creation failed. User not found.")
        return user


def get_user(user_id: int) -> Optional[User]:
    query = connection.cursor()
    query.execute(
        "SELECT id, username, email, password, role FROM users WHERE id = ?", (user_id,)
    )
    row = query.fetchone()
    if row:
        return User(
            id=row[0],
            username=row[1],
            email=row[2],
            password=row[3],
            role=get_role_from_string(row[4]),
        )
    return None


def get_user_by_name(username: str) -> Optional[User]:
    query = connection.cursor()
    query.execute(
        "SELECT id, username, email, password, role FROM users WHERE username = ?",
        (username,),
    )
    row = query.fetchone()
    if row:
        return User(
            id=row[0],
            username=row[1],
            email=row[2],
            password=row[3],
            role=get_role_from_string(row[4]),
        )
    return None


def update_user(user: User) -> None:
    with connection:
        query = connection.cursor()
        query.execute(
            """
            UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?
        """,
            (user.username, user.email, user.password, user.role.value, user.id),
        )
