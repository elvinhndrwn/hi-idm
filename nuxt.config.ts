export default defineNuxtConfig({
  compatibilityDate: "2025-12-11",

  modules: ["@nuxtjs/tailwindcss"],
  ssr: false,
  css: ["assets/css/tailwind.css", "assets/css/transitions.css"],

  app: {
    head: {
      title: "Hi - IDM",
      meta: [
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "Hi - IDM" },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/images/face.png",
        },
      ],
    },
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  tailwindcss: {
    viewer: false,
  },
});
