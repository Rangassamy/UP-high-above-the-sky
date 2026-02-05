from fastapi import FastAPI

from src.core.database import init_db

from .routes import register
from .routes import login
from .routes import product
from .routes import promo_code
from .routes import cart
from src.routes import me

app = FastAPI()

app.include_router(register.router)
app.include_router(login.router)
app.include_router(product.router)
app.include_router(me.router)
app.include_router(promo_code.router)
app.include_router(cart.router)

init_db.init()


@app.get("/")
def read_root():
    return {"Hello": "World"}
