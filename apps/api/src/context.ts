import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { db } from "./db";
import { schema } from "./schema";
export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res, db, dbSchema: schema };
}

export type Context = inferAsyncReturnType<typeof createContext>;
