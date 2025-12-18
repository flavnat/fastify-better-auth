import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import dbplugin from "../plugins/db.js"
import * as schema from "../db/schema.js";

export const auth = betterAuth({
    database: drizzleAdapter(dbplugin, {
        provider: "sqlite",
        schema: schema,
    }),
    emailAndPassword: { enabled: true }
});