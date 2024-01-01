export const EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "0.0.0.0",
  PORT: process.env.PORT || "3011",
  JWT_SECRET: process.env.JWT_SECRET || "1234567890",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres",
};
