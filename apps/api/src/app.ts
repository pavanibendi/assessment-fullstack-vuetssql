import fastify from "fastify";
import cors from "@fastify/cors";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { createContext } from "./context";
import { appRouter } from "./trpc/router";
import { EnvConfig } from "./env.config";

const server = fastify({
  maxParamLength: 5000,
  logger: { level: "debug" },
});
server.addHook("onRoute", (opts) => {
  if (opts.path === "/health") {
    opts.logLevel = "silent";
  }
});

server.register(cookie, {
  secret: "some-secret", // for cookies signature
  parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);

// !strict origin in production
server.register(cors, {
  origin: EnvConfig.NODE_ENV !== "production",
  credentials: true,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

import { healthRouter } from "./routes/health";
server.register(healthRouter, { prefix: "/health" });

const portWithDefault = EnvConfig.PORT;
const port = parseInt(portWithDefault);
const hostClickable = port === 8080 ? "0.0.0.0" : "localhost";
const host = EnvConfig.HOST;

(async () => {
  try {
    await server.listen({ port, host });
    console.info(`🚀 Fastify server ready at http://${hostClickable}:${port}`);
    console.info(`🚀 is this automatically deployed?`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
