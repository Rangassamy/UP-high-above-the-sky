import { api } from "./http";

const DEFAULT_VALIDATE = "/code/check";
const VALIDATE_BASE =
  import.meta.env.VITE_PROMO_VALIDATE_PATH || DEFAULT_VALIDATE;

export const PromosAPI = {
  validate(code) {
    const c = String(code || "").trim();
    if (!c) return Promise.resolve({ success: false, content: {} });

    return api(`${VALIDATE_BASE}/${encodeURIComponent(c)}`, { auth: false });
  },

  list: () => api("/codes"),
  create: (payload) => api("/code", { method: "POST", body: payload }),
  update: (id, payload) =>
    api(`/code/${encodeURIComponent(id)}`, { method: "PUT", body: payload }),
  remove: (id) => api(`/code/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
