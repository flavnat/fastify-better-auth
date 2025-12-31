import type { FastifyInstance } from "fastify";
import { requireAuth, optionalAuth } from "../middleware/index.js";

/**
 * User Routes
 * 
 * Example routes demonstrating authentication middleware usage.
 */
export default async function userRoutes(fastify: FastifyInstance) {
    /**
     * Get current user (protected)
     * 
     * Returns the currently authenticated user's information.
     * Requires authentication.
     */
    fastify.get(
        "/user/me",
        { preHandler: requireAuth },
        async (request, reply) => {
            return {
                success: true,
                data: {
                    user: request.user,
                    session: {
                        id: request.session?.id,
                        expiresAt: request.session?.expiresAt,
                    },
                },
            };
        }
    );

    /**
     * Get user profile (optional auth)
     * 
     * Returns a personalized or generic greeting based on auth status.
     */
    fastify.get(
        "/user/profile",
        { preHandler: optionalAuth },
        async (request, reply) => {
            if (request.user) {
                return {
                    authenticated: true,
                    message: `Welcome back, ${request.user.name}!`,
                    user: {
                        id: request.user.id,
                        name: request.user.name,
                        email: request.user.email,
                        image: request.user.image,
                    },
                };
            }

            return {
                authenticated: false,
                message: "Welcome, guest! Please sign in to access your profile.",
            };
        }
    );

    /**
     * Protected example route
     * 
     * A simple protected route to demonstrate authentication.
     */
    fastify.get(
        "/user/dashboard",
        { preHandler: requireAuth },
        async (request, reply) => {
            return {
                success: true,
                message: "Welcome to your dashboard!",
                user: {
                    id: request.user?.id,
                    name: request.user?.name,
                    email: request.user?.email,
                },
            };
        }
    );
}
