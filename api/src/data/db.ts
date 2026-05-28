import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {z} from "zod";
import * as authSchema from "./schemas/auth-schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as path from "node:path";
import * as fs from "node:fs";

export const { DATABASE_URL } = z.object({
    DATABASE_URL: z.string().nonempty()
}).parse(process.env);

export const db = drizzle(DATABASE_URL, {
    logger: true,
    schema: {
        ...authSchema
    }
});

const migrationsFolder = path.join(process.cwd(), '.drizzle');
export async function autoMigrate() {
    await migrate(db, { migrationsFolder })
}