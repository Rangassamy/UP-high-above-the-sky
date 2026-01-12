import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_EMAIL = "admin@up.local";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { email, role }

      login(email, password) {
        const e = String(email || "")
          .trim()
          .toLowerCase();
        const p = String(password || "");
        if (!e || !p)
          return { ok: false, error: "Email et mot de passe requis." };

        const role = e === ADMIN_EMAIL ? "admin" : "customer";
        set({ user: { email: e, role } });
        return { ok: true };
      },

      register(email, password) {
        return get().login(email, password);
      },

      logout() {
        set({ user: null });
      },

      isAdmin() {
        return get().user?.role === "admin";
      },
    }),
    { name: "up_auth_full" }
  )
);
