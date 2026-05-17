import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import {betterAuth} from "better-auth";
import {db} from "./data/db.js";
import {openAPI} from "better-auth/plugins";
import {uuidv7} from "uuidv7";



export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
    },
    advanced: {
        database: {
            generateId: () => uuidv7(),
        }
    },
    plugins: [
        openAPI()
    ]
})