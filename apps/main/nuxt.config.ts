// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  telemetry: false,
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },
  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
      },
      {
        path: "../../packages/ui/src/components",
        pathPrefix: false,
      },
    ],
  },
  app: {
    head: {
      title: "Jdwly",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui",
        },
      ],
      htmlAttrs: {
        class:
          "h-full anti-aliased text-gray-900 font-sans leading-normal text-base bg-gray-50 dark:bg-gray-900 dark:text-gray-50 dark:font-sans dark:leading-normal dark:text-base dark:antialiased",
      },
      bodyAttrs: {
        class: "min-h-screen bg-gray-50",
      },
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.png",
        },
      ],
    },
  },
  typescript: {
    strict: true,
  },
  modules: ["nuxt-typed-router", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  nuxtTypedRouter: {
    strict: true,
  },
});
