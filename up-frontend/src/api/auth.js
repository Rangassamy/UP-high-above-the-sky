import { api, setToken, clearToken } from "./http";

export const AuthAPI = {
  async login({ username, password }) {
    const data = await api("/login", {
      method: "POST",
      body: { username, password },
      auth: false,
    });

    if (data?.access_token) setToken(data.access_token);
    return data;
  },

  async register({ username, email, password }) {
    const data = await api("/register", {
      method: "POST",
      body: { username, email, password },
      auth: false,
    });
    if (data?.access_token) setToken(data.access_token);
    return data;
  },

  async me() {
    return api("/me");
  },

  logout() {
    return api("/logout", {
      method: "POST",
      auth: false,
    })
      .catch(() => null)
      .finally(() => clearToken());
  },
};
