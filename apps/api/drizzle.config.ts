import type { Config } from "drizzle-kit";
import { EnvConfig } from "./src/env.config";

export default {
  driver: "pg",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    connectionString: EnvConfig.DATABASE_URL,
  },
} satisfies Config;
