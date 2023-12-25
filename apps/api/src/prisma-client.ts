import { PrismaClient } from "../generated/client";

// non-local database env variables
const dbUsername = process.env.DATABASE_USERNAME as string;
const dbPassword = process.env.DATABASE_PASSWORD as string;
const dbHost = process.env.DATABASE_HOST as string;
const dbPort = process.env.DATABASE_PORT as string;
const dbName = process.env.DATABASE_NAME as string;

// normalized database url
const dbUrl =
  (process.env.DATABASE_URL as string) ||
  `postgresql://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

// todo: use env variable to determine if we should log queries
export const prisma = new PrismaClient({
  log: ["query"],
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});
