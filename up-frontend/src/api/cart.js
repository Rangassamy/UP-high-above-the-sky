/* API du panier connecte. */

import { api } from "./http";

export const CartAPI = {
  list: () => api("/carts"),

  add(productId, quantity = 1) {
    const pid = encodeURIComponent(productId);
    const q = Math.max(1, Number(quantity || 1));
    return api(`/cart?product_id=${pid}&quantity=${q}`, { method: "POST" });
  },

  remove(productId) {
    const pid = encodeURIComponent(productId);
    return api(`/cart/${pid}`, { method: "DELETE" });
  },

  clear: () => api("/carts", { method: "DELETE" }),
};
