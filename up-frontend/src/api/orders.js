import { api } from "./http";

export const OrdersAPI = {
  // Client: crée une commande depuis le panier serveur
  buy: (promoId, payload) => {
    const qs = promoId ? `?promo_id=${encodeURIComponent(promoId)}` : "";
    return api(`/buy${qs}`, { method: "POST", body: payload });
  },

  mine: () => api("/orders/me"),
  list: () => api("/orders"), // admin
  updateStatus: (id, status) =>
    api(`/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { status },
    }),
};
