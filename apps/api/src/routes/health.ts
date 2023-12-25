import { FastifyPluginCallback } from "fastify";
import { prisma } from "../prisma-client";

export const healthRouter: FastifyPluginCallback = (fastify, options, done) => {
  fastify.get("/", async () => {
    return { status: "ok" };
  });
  fastify.get("/db", async () => {
    const queryResult = await prisma.$queryRaw`SELECT 1 + 1 as "onePlusOne"`;
    return { status: "ok", queryResult };
  });
  done();
};
