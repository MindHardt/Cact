import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {z} from "zod";
import * as authSchema from "./schemas/auth-schema.js";

export const { DATABASE_URL } = z.object({
    DATABASE_URL: z.string().nonempty()
}).parse(process.env);

export const db = drizzle(DATABASE_URL, {
    logger: true,
    schema: {
        ...authSchema
    }
});