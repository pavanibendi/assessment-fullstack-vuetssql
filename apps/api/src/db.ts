import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";
import { schema } from "./schema";

const databaseUrl = "postgres://postgres:postgres@localhost:5432/postgres";

const client = postgres(databaseUrl);

const db = drizzle(client, {
  schema,
});

export { db, schema };
