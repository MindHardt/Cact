import {index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { users } from "../../data/schemas/auth-schema";
import {sql, type SQL } from "drizzle-orm";
import { type NutritionalFacts } from "cact-shared/extras";
import {uploads} from "../uploads/upload-schema";
import type {FoodUnit} from "cact-shared/zFood";


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
    units: jsonb('units').$type<FoodUnit[]>().notNull(),
    imageId: uuid('image_id').references(() => uploads.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date())
}, table => [
    index('foods_tags_idx').on(table.tags)
]);