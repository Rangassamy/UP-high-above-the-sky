from fastapi import FastAPI

from src.core.database import init_db

from .routes import register
from .routes import login
from .routes import product

app = FastAPI()

app.include_router(register.router)
app.include_router(login.router)
app.include_router(product.router)

init_db.init()


@app.get("/")
def read_root():
    return {"Hello": "World"}
