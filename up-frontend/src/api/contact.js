import { api } from "./http";

export const ContactAPI = {
  send: (payload) => api("/contact", { method: "POST", body: payload, auth: false }),
};
