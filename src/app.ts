import Fastify from "fastify";
import { env } from "./config/env.js";
import { envToLogger } from "./config/logger.js";
import { dbPlugin, corsPlugin, authPlugin } from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";

/**
 * Create and configure the Fastify instance
 */
const fastify = Fastify({
  logger: envToLogger[env.NODE_ENV] ?? true,
});

/**
 * Start the server
 */
async function start() {
  try {
    // Register plugins in order (dependencies matter!)
    await fastify.register(dbPlugin);
    await fastify.register(corsPlugin);
    await fastify.register(authPlugin);

    // Register application routes
    await registerRoutes(fastify);

    // Root route
    fastify.get("/", async () => {
      return {
        name: "Fastify + Better Auth API",
        version: "1.0.0",
        status: "running",
        docs: {
          auth: "/api/auth/* - Authentication endpoints",
          health: "/api/health - Health check",
          user: "/api/user/* - User endpoints (protected)",
        },
      };
    });

    // Start listening
    const address = await fastify.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    fastify.log.info(`🚀 Server running at ${address}`);
    fastify.log.info(`📚 Auth endpoints available at ${address}/api/auth/*`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle shutdown gracefully
const signals = ["SIGINT", "SIGTERM"] as const;
signals.forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, shutting down gracefully...`);
    await fastify.close();
    process.exit(0);
  });
});

// Start the server
start();