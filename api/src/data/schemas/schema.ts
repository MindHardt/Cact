import {index, jsonb, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {uuidv7} from "uuidv7";
import type {NutritionalFacts} from "./extras.js";
import {users} from "./auth-schema.js";
import {SQL, sql} from "drizzle-orm";


export const foods = pgTable('foods', {
    id: uuid('id').primaryKey().$default(() => uuidv7()),
    name: text('name').notNull(),
    description: text('description'),
    facts: jsonb('facts').$type<NutritionalFacts>(),
    authorId: uuid('author_id').references(() => users.id, { onDelete: "set null" }),
    tags: text('tags')
        .notNull()
        .generatedAlwaysAs((): SQL =>
            // lang=postgresql
            sql`UPPER(${foods.name} || ' ' || COALESCE(${foods.description}, ''))`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index('foods_tags_idx').on(table.tags)
]);

