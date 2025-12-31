import type { FastifyInstance } from "fastify";
import healthRoutes from "./health.js";
import userRoutes from "./user.js";

/**
 * Register all routes
 * 
 * This function registers all route modules with the Fastify instance.
 */
export async function registerRoutes(fastify: FastifyInstance) {
    // Health check routes
    await fastify.register(healthRoutes, { prefix: "/api" });

    // User routes (protected)
    await fastify.register(userRoutes, { prefix: "/api" });

    fastify.log.info("Routes registered");
}
