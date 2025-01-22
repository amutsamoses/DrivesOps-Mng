import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import Stripe from "stripe";

const { Client } = pg;

// validate envirinment viriables
const connectionString = process.env.DATABASE_URL as string;
const stripeSecretApiKey = process.env.STRIPE_SECRET_API_KEY as string;

if (!connectionString) {
  console.error("Error: DATABASE_URL is not defined in the environment.");
  process.exit(1);
}

if (!stripeSecretApiKey) {
  console.error(
    "Error: STRIPE_SECRET_API_KEY is not defined in the environment."
  );
  process.exit(1); // exit the process if the environment variable is not defined
}

// initializing the postgres client
export const client = new Client({
  connectionString, // get the database URL from the environment
});

const main = async () => {
  try {
    await client.connect(); // connect to the database
    console.log("Connected to the database");
  } catch (error: any) {
    console.error("Error connecting to the database:", error.message);
    console.error("Full error details:", error);
    process.exit(1); // Exit on database connection failure
  }
  // await client.connect(); // connect to the database
  // console.log("Connected to the database");
};

// run the database connection function
main();

// Initialize Drizzle ORM with schema and logging
const db = drizzle(client, { schema, logger: true });

export default db;

// stripe instance
export const stripe = new Stripe(stripeSecretApiKey, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});
