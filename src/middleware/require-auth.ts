import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";

/**
 * Require Auth Middleware
 * 
 * Use this as a preHandler hook to protect routes that require authentication.
 * Populates request.session and request.user if the user is authenticated.
 * 
 * @example
 * fastify.get("/protected", { preHandler: requireAuth }, async (request, reply) => {
 *   return { user: request.user };
 * });
 */
export async function requireAuth(
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
) {
    try {
        const { session, user } = await request.server.getSession(request);

        if (!session || !user) {
            return reply.status(401).send({
                error: "Unauthorized",
                message: "You must be logged in to access this resource",
                code: "UNAUTHORIZED",
            });
        }

        // Attach session and user to request
        request.session = session;
        request.user = user;

        done();
    } catch (error) {
        request.server.log.error("Auth middleware error:", error);
        return reply.status(500).send({
            error: "Internal server error",
            code: "AUTH_CHECK_FAILED",
        });
    }
}

/**
 * Optional Auth Middleware
 * 
 * Use this as a preHandler hook to optionally populate session data.
 * Does not reject requests without authentication.
 * 
 * @example
 * fastify.get("/public", { preHandler: optionalAuth }, async (request, reply) => {
 *   if (request.user) {
 *     return { message: `Hello, ${request.user.name}!` };
 *   }
 *   return { message: "Hello, guest!" };
 * });
 */
export async function optionalAuth(
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
) {
    try {
        const { session, user } = await request.server.getSession(request);

        if (session && user) {
            request.session = session;
            request.user = user;
        }

        done();
    } catch (error) {
        request.server.log.error("Optional auth middleware error:", error);
        // Don't fail the request, just continue without session
        done();
    }
}
