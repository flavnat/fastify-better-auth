import "dotenv/config";
import z from "zod";

const envSchema = z.object({
    // Server
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),

    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(32, "Secret must be at least 32 characters"),
    BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),

    // Database
    DATABASE_URL: z.string().url("Must be a valid connection string"),

    // Client
    CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;