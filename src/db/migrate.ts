import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, closeDatabase } from "./index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  console.log("↺ Running migrations...");

  try {
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../../drizzle"),
    });
    console.log("✓ Migrations completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

runMigrations();
