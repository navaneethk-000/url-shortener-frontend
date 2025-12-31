import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: useCookie("auth_token").value || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userInitial: (state) => {
      if (state.user?.name) return state.user.name.charAt(0).toUpperCase();
      if (state.user?.email) return state.user.email.charAt(0).toUpperCase();
      return "U";
    },
  },

  actions: {
    async register(name, email, password) {
      const config = useRuntimeConfig();
      const { data, error } = await useFetch(
        `${config.public.apiBase}/api/register`,
        {
          method: "POST",
          body: { name, email, password },
        }
      );

      if (error.value) {
        throw error.value;
      }
      return true;
    },

    hydrateUser(tokenStr) {
      if (!tokenStr) return;
      try {
        const base64Url = tokenStr.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        this.user = {
          email: payload.email,
          id: payload.user_id,
          name: payload.name,
        };
      } catch (e) {
        console.error("Token hydration failed", e);
        this.logout();
      }
    },

    initAuth() {
      const tokenCookie = useCookie("auth_token");
      if (tokenCookie.value) {
        this.token = tokenCookie.value;
        this.hydrateUser(this.token);
      }
    },

    async login(email, password) {
      const config = useRuntimeConfig();
      const { data, error } = await useFetch(
        `${config.public.apiBase}/api/login`,
        {
          method: "POST",
          body: { email, password },
        }
      );

      if (error.value) throw error.value;

      this.token = data.value.token;
      const tokenCookie = useCookie("auth_token");
      tokenCookie.value = data.value.token;
      this.hydrateUser(data.value.token);

      return true;
    },

    logout() {
      this.token = null;
      this.user = null;
      const tokenCookie = useCookie("auth_token");
      tokenCookie.value = null;
      navigateTo("/login");
    },
  },
});
