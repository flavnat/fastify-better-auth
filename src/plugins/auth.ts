import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { auth, type Session, type User } from "../lib/auth.js";

declare module "fastify" {
    interface FastifyInstance {
        auth: typeof auth;
        getSession: (
            request: FastifyRequest
        ) => Promise<{ session: Session | null; user: User | null }>;
    }

    interface FastifyRequest {
        session: Session | null;
        user: User | null;
    }
}

/**
 * Auth Plugin
 * 
 * Integrates Better Auth with Fastify:
 * - Decorates the fastify instance with the auth object
 * - Adds a getSession helper method
 * - Sets up the auth handler routes
 */
async function authPlugin(fastify: FastifyInstance) {
    // Decorate fastify instance with auth
    fastify.decorate("auth", auth);

    // Decorate with session getter helper
    fastify.decorate("getSession", async (request: FastifyRequest) => {
        const session = await auth.api.getSession({
            headers: request.headers as unknown as Headers,
        });
        return session ?? { session: null, user: null };
    });

    // Decorate requests with session and user
    fastify.decorateRequest("session", null);
    fastify.decorateRequest("user", null);

    // Register the auth handler catch-all route
    fastify.route({
        method: ["GET", "POST"],
        url: "/api/auth/*",
        async handler(request: FastifyRequest, reply: FastifyReply) {
            try {
                // Construct the full URL
                const url = new URL(
                    request.url,
                    `${request.protocol}://${request.headers.host}`
                );

                // Convert Fastify headers to standard Headers object
                const headers = new Headers();
                Object.entries(request.headers).forEach(([key, value]) => {
                    if (value) {
                        if (Array.isArray(value)) {
                            value.forEach((v) => headers.append(key, v));
                        } else {
                            headers.set(key, value);
                        }
                    }
                });

                // Create a Fetch API-compatible request
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    body: request.body ? JSON.stringify(request.body) : undefined,
                });

                // Process the authentication request
                const response = await auth.handler(req);

                // Forward response status and headers
                reply.status(response.status);
                response.headers.forEach((value, key) => {
                    reply.header(key, value);
                });

                // Send response body
                if (response.body) {
                    const text = await response.text();
                    return reply.send(text);
                }

                return reply.send(null);
            } catch (error) {
                fastify.log.error("Authentication Error:", error);
                return reply.status(500).send({
                    error: "Internal authentication error",
                    code: "AUTH_FAILURE",
                });
            }
        },
    });

    fastify.log.info("Auth plugin registered - routes: /api/auth/*");
}

export default fp(authPlugin, {
    name: "auth",
    dependencies: ["db", "cors"],
});
