import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { EnvConfig } from "./env.config";

const databaseUrl = EnvConfig.DATABASE_URL;

const client = postgres(databaseUrl);

const db = drizzle(client, {
  schema,
});

export { db, schema };
