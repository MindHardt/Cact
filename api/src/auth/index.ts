import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import {betterAuth} from "better-auth";
import {db} from "../data/db.js";
import {openAPI} from "better-auth/plugins";
import {uuidv7} from "uuidv7";
import {z} from "zod";

const oauthConfig = z.union([
    z.object({
        GITHUB_CLIENT_ID: z.string().nonempty(),
        GITHUB_CLIENT_SECRET: z.string().nonempty()
    }),
    z.object({})
]).parse(process.env);


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true
    }),
    socialProviders: {
        github: ('GITHUB_CLIENT_ID' in oauthConfig ? {
            clientId: oauthConfig.GITHUB_CLIENT_ID,
            clientSecret: oauthConfig.GITHUB_CLIENT_SECRET
        } : undefined)
    },
    advanced: {
        database: {
            generateId: () => uuidv7(),
        }
    },
    plugins: [
        openAPI()
    ]
});