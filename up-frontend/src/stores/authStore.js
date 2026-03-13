import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearToken, getToken } from "../api/http";
import { AuthAPI } from "../api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: getToken() || null,
      loading: false,
      error: "",

      async login(username, password) {
        try {
          set({ loading: true, error: "" });
          const data = await AuthAPI.login({ username, password });
          set({ token: data?.access_token || get().token || null });
          // Try to load full profile if backend supports /me
          await get().fetchMe();
          if (!get().user) set({ user: { username } });
          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async register(username, email, password) {
        try {
          set({ loading: true, error: "" });
          const data = await AuthAPI.register({ username, email, password });
          set({ token: data?.access_token || get().token || null });
          await get().fetchMe();
          if (!get().user) set({ user: { username, email } });
          set({ loading: false });
          return { ok: true };
        } catch (e) {
          set({ loading: false, error: e.message || "Erreur" });
          return { ok: false, error: e.message };
        }
      },

      async fetchMe() {
        try {
          const me = await AuthAPI.me();
          const user = me?.user || me?.content || me;
          if (user) set({ user });
          return { ok: true, user };
        } catch (e) {
          if (e?.status === 401) {
            clearToken();
            set({ user: null, token: null });
            return { ok: true, user: null };
          }
          return { ok: false, error: e.message };
        }
      },
      async logout() {
        await AuthAPI.logout();
        clearToken();
        set({ user: null, token: null, error: "" });
      },
    }),
    { name: "up-auth" },
  ),
);
