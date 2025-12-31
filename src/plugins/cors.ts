import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { env } from "../config/env.js";

/**
 * CORS Plugin
 * 
 * Configures Cross-Origin Resource Sharing for the API.
 * Allows requests from the configured client origin with credentials.
 */
async function corsPlugin(fastify: FastifyInstance) {
    await fastify.register(cors, {
        origin: env.CLIENT_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
        ],
        credentials: true,
        maxAge: 86400, // 24 hours
    });

    fastify.log.info(`CORS enabled for origin: ${env.CLIENT_ORIGIN}`);
}

export default fp(corsPlugin, {
    name: "cors",
});
