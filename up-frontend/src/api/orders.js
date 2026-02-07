import { api } from "./http";

export const OrdersAPI = {
  // Client: crée une commande depuis le panier serveur
  buy: (promoId) => {
    const qs = promoId ? `?promo_id=${encodeURIComponent(promoId)}` : "";
    return api(`/buy${qs}`, { method: "POST" });
  },

  mine: () => api("/orders/me"),
  list: () => api("/orders"), // admin
};
