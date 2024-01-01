/// <reference types="@fastify/cookie" />

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "staging" | "production";
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}
