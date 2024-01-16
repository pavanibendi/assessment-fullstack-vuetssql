import { uuid, text, timestamp, pgTable, integer, pgEnum } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  hashedPassword: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  emailVerified: timestamp("email_verified"),
});

export const emailChangeRequest = pgTable("email_change_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  newEmail: text("new_email").notNull(),
  otpCode: text("otp_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailVerification = pgTable("email_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  email: text("email").notNull(),
  otpCode: text("otp_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  attempts: integer("attempts").default(0).notNull(),
});

export const passwordResetRequest = pgTable("password_reset_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const team = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by").references(() => user.id)
});

export const teamMember = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => team.id),
  userId: uuid("user_id").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const statusEnum = pgEnum('status', ['todo', 'in-progress', 'review', 'complete']);

// We can add additional columns such as story points etc.
export const task = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: statusEnum('status'),
  assignedTo: uuid("assigned_to").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});