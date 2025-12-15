export default defineNuxtConfig({
  compatibilityDate: "2025-12-11",

  modules: ["@nuxtjs/tailwindcss"],
  ssr: false,
  css: ["assets/css/tailwind.css", "assets/css/transitions.css"],

  app: {
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  tailwindcss: {
    viewer: false,
  },
});
