import type { FastifyInstance } from "fastify";

/**
 * Health Check Routes
 * 
 * Provides endpoints for monitoring the application health.
 */
export default async function healthRoutes(fastify: FastifyInstance) {
    // Basic health check
    fastify.get("/health", async () => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    });

    // Detailed health check (can be extended for database checks, etc.)
    fastify.get("/health/detailed", async () => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version,
        };
    });
}
