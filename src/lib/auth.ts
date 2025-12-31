import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { env } from "../config/env.js";

/**
 * Better Auth Configuration
 * 
 * This is the main auth configuration for Better Auth.
 * Customize this based on your authentication needs.
 * 
 * @see https://www.better-auth.com/docs/installation
 */
export const auth = betterAuth({
    // Database adapter using Drizzle ORM with SQLite
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),

    // Base URL for auth endpoints
    baseURL: env.BETTER_AUTH_URL,

    // Secret key for signing tokens
    secret: env.BETTER_AUTH_SECRET,

    // Enable email and password authentication
    emailAndPassword: {
        enabled: true,
        // Uncomment to require email verification
        // requireEmailVerification: true,
    },

    // Session configuration
    session: {
        // Session expiration time (7 days in seconds)
        expiresIn: 60 * 60 * 24 * 7,
        // How often to refresh the session (1 day in seconds)
        updateAge: 60 * 60 * 24,
        // Cookie configuration
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        },
    },

    // Trusted origins for CORS
    trustedOrigins: [
        env.CLIENT_ORIGIN,
        env.BETTER_AUTH_URL,
    ],

    // Logger configuration
    logger: {
        level: env.NODE_ENV === "development" ? "debug" : "error",
    },

    // Advanced configuration
    advanced: {
        // Disable CSRF check for development
        // Enable in production for better security
        disableCSRFCheck: env.NODE_ENV === "development",
    },

    // Add social providers here
    // socialProviders: {
    //   google: {
    //     clientId: process.env.GOOGLE_CLIENT_ID!,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   },
    //   github: {
    //     clientId: process.env.GITHUB_CLIENT_ID!,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    //   },
    // },
});

// Export auth types for use in other parts of the application
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;