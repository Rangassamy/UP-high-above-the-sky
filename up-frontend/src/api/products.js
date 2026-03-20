/* API du catalogue produit. */

import { api, apiUrl, getToken } from "./http";

export const ProductsAPI = {
  list: () => api("/products", { auth: false }),

  createOne: (payload) => api("/product", { method: "POST", body: payload }),

  updateOne: (payloadWithId) =>
    api("/products", { method: "PUT", body: [payloadWithId] }),

  remove: (id) =>
    api(`/product/${encodeURIComponent(id)}`, { method: "DELETE" }),

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = getToken();
    const res = await fetch(`${apiUrl()}/product/image`, {
      method: "POST",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      credentials: "include",
    });

    const raw = await res.text().catch(() => "");
    const data = raw
      ? (() => {
          try {
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })()
      : null;

    if (!res.ok) {
      const msg = data?.detail || data?.message || raw || `HTTP ${res.status}`;
      const error = new Error(msg);
      error.status = res.status;
      throw error;
    }

    return data;
  },
};
