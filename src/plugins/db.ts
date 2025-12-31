import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { db, closeDatabase } from "../db/index.js";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../db/schema.js";

declare module "fastify" {
  interface FastifyInstance {
    db: NodePgDatabase<typeof schema>;
  }
}

/**
 * Database Plugin
 * 
 * Decorates the Fastify instance with the Drizzle ORM database connection.
 * Automatically closes the connection when the server shuts down.
 */
async function dbPlugin(fastify: FastifyInstance) {
  // Decorate fastify instance with database
  fastify.decorate("db", db);

  // Close database connection on server shutdown
  fastify.addHook("onClose", async () => {
    fastify.log.info("Closing database connection...");
    closeDatabase();
  });

  fastify.log.info("Database plugin registered");
}

export default fp(dbPlugin, {
  name: "db",
});