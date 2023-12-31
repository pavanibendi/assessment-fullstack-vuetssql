import { uuid, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";

const user = pgTable("users", {
  id: uuid("id").primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  hashedPassword: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  emailVerified: timestamp("email_verified"),
});

const emailChangeRequest = pgTable("email_change_requests", {
  id: uuid("id").primaryKey().default("gen_random_uuid()"),
  userId: uuid("user_id").notNull(),
  newEmail: text("new_email").notNull(),
  otpCode: text("otp_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const emailVerification = pgTable("email_verifications", {
  id: uuid("id").primaryKey().default("gen_random_uuid()"),
  userId: uuid("user_id").notNull(),
  email: text("email").notNull(),
  otpCode: text("otp_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  attempts: integer("attempts").default(0).notNull(),
});

const passwordResetRequest = pgTable("password_reset_requests", {
  id: uuid("id").primaryKey().default("gen_random_uuid()"),
  userId: uuid("user_id").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schema = {
  user,
  emailChangeRequest,
  emailVerification,
  passwordResetRequest,
};
