import { FastifyPluginCallback } from "fastify";
import { db, sql } from "../db";

export const healthRouter: FastifyPluginCallback = (fastify, options, done) => {
  fastify.get("/", async () => {
    return { status: "ok" };
  });
  fastify.get("/db", async () => {
    const queryResult = await db.execute(sql`SELECT 1+1 as result`);
    return { status: "ok", queryResult };
  });
  done();
};
