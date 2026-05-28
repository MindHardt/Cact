import {index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {type NutritionalFacts, zNutritionalFacts} from "../../data/schemas/extras.js";
import { uuidv7 } from "uuidv7";
import { users } from "../../data/schemas/auth-schema.js";
import {sql, type SQL } from "drizzle-orm";
import z from "zod";


export const foods = pgTable('foods', {
    id: uuid('id').primaryKey().$default(() => uuidv7()),
    name: text('name').notNull(),
    description: text('description'),
    facts: jsonb('facts').$type<NutritionalFacts>().notNull(),
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

export const zFood = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    facts: zNutritionalFacts,
    authorId: z.uuid().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
});

export type Food = z.infer<typeof zFood>;