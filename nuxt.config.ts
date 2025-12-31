// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "GoShortener",
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/fevicon-goshortener.png",
        },
      ],
    },
  },

  ssr: false,

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8080",
    },
  },
});
