import { api } from "./http";

export const ProductsAPI = {
  list: () => api("/products", { auth: false }),

  createOne: (payload) => api("/product", { method: "POST", body: payload }),

  updateOne: (payloadWithId) =>
    api("/products", { method: "PUT", body: [payloadWithId] }),

  remove: (id) =>
    api(`/product/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
