import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query";
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
  useQuery,
  useMutation,
} from "@tanstack/vue-query";
// Nuxt 3 app aliases
import { useState } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");
  // Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
      },
      mutations: {
        onError: (error) => {
          console.error(error);
        },
      },
    },
  });
  const options: VueQueryPluginOptions = { queryClient };
  nuxtApp.vueApp.use(VueQueryPlugin, options);

  // hydration hooks
  if (process.server) {
    nuxtApp.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }
  if (process.client) {
    nuxtApp.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }

  return {
    provide: {
      queryClient,
      useQuery,
      useMutation,
    },
  };
});
