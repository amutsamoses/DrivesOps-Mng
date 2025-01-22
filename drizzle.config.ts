import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// validate the environment variables
const databaseUrl = process.env.DATABASE_URL as string;

if (!databaseUrl) {
  console.error("Error: DATABASE_URL is not defined in the environment.");
  process.exit(1);
}

export default defineConfig({
  dialect: "postgresql", // or "mysql" or "sqlite"
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",

  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },

  verbose: true,
  strict: true,
});
