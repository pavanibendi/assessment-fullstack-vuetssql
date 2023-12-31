import type { AppRouter } from "@mono/api/src/trpc/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import {
  createTRPCProxyClient,
  httpBatchLink,
  loggerLink,
  type TRPCLink,
} from "@trpc/client";
import { useAuthStore } from "@/store/auth";

const errorLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      return next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          const { message } = err;
          console.error("errorLink: ", message);
          if (message === "UNAUTHORIZED") {
            const authStore = useAuthStore();
            authStore.clearUser();
          }
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  };
};

const apiUrls = {
  development: "http://localhost:3011/trpc",
  staging: "https://gcx6cdgxtm.eu-west-1.awsapprunner.com/trpc",
  production: "https://929djxtffb.eu-west-1.awsapprunner.com/trpc",
};

export const useTrpcClient = () => {
  const VITE_DEPLOYMENT_ENV = (import.meta.env.VITE_DEPLOYMENT_ENV ||
    "development") as DEPLOYMENT_ENV;
  // const config = useRuntimeConfig();
  // const deploymentEnv = config.public.DEPLOYMENT_ENV as DEPLOYMENT_ENV;
  const url = apiUrls[VITE_DEPLOYMENT_ENV];
  // return client
  return createTRPCProxyClient<AppRouter>({
    links: [
      errorLink,
      loggerLink({
        enabled: (opts) =>
          (process.env.NODE_ENV === "development" &&
            typeof window !== "undefined") ||
          opts.direction === "down",
      }),
      httpBatchLink({
        url,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });
};

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
