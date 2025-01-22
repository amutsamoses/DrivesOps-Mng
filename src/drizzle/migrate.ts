import "dotenv/config";

import { migrate } from "drizzle-orm/node-postgres/migrator";
import db, { client } from "./db";

async function migration() {
  console.log("===== Migrating =====");
  await migrate(db, { migrationsFolder: __dirname + "/migrations" });
  await client.end();
  console.log("===== Done =====");
  process.exit(0); // 0 for success, 1 for failure
}

migration().catch((e) => {
  console.error(e);
  process.exit(0); // 0 for success, 1 for failure
});
