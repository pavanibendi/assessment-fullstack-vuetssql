import { uuid, text, timestamp, pgTable } from "drizzle-orm/pg-core";

const user = pgTable("users", {
  id: uuid("id").primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  hashedPassword: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const schema = {
  user,
};
