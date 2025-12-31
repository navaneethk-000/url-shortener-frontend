import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: useCookie("auth_token").value || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    //  Ensures the avatar updates as soon as user data exists
    userInitial: (state) => {
      if (state.user?.name) return state.user.name.charAt(0).toUpperCase();
      if (state.user?.email) return state.user.email.charAt(0).toUpperCase();
      return "U";
    },
  },

  actions: {
    // Helper to decode JWT and set user state
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

    // Runs on App Start
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

      // Update Token State
      this.token = data.value.token;

      //  Update Cookie (for persistence)
      const tokenCookie = useCookie("auth_token");
      tokenCookie.value = data.value.token;

      // Immediately update the User state in memory
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
