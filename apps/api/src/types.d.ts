/// <reference types="@fastify/cookie" />

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "staging" | "production";
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}
