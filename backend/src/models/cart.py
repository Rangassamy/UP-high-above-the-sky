class Cart:
    def __init__(self, product_id: int, quantity: int, user_id: int) -> None:
        self.product_id = product_id
        self.quantity = quantity
        self.user_id = user_id
