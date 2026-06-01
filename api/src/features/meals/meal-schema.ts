import {index, jsonb, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {uuidv7} from "uuidv7";
import {type FoodPortion} from "cact-shared/zMeal.js";
import {users} from "../../data/schemas/auth-schema.js";
import type { NutritionalFacts } from "cact-shared/zNutritionalFacts.js";

export const meals = pgTable('meals', {
    id: uuid('id').primaryKey().$default(() => uuidv7()),
    note: text('note'),
    mealTime: timestamp('meal_time').notNull(),
    portions: jsonb('portions').notNull().$type<FoodPortion[]>(),
    nutrition: jsonb('nutrition').notNull().$type<NutritionalFacts>(),
    userId: uuid('user_id').notNull().references(() => users.id)
}, table => [
    index('meal_time_user_idx').on(table.userId, table.mealTime)
])