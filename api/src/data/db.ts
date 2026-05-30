import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {z} from "zod";
import * as authSchema from "./schemas/auth-schema.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as path from "node:path";

export const { DATABASE_URL, DATABASE_MIGRATIONS_FOLDER } = z.object({
    DATABASE_URL: z.string().nonempty(),
    DATABASE_MIGRATIONS_FOLDER: z.string().optional().default(() => path.join(process.cwd(), '.drizzle'))
}).parse(process.env);

export const db = drizzle(DATABASE_URL, {
    logger: true,
    schema: {
        ...authSchema
    }
});

export async function autoMigrate() {
    await migrate(db, { migrationsFolder: DATABASE_MIGRATIONS_FOLDER })
}