import {index, integer, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {uuidv7} from "uuidv7";
import {users} from "../../data/schemas/auth-schema.js";


export const targets = pgTable('targets', {
    id: uuid('id').primaryKey().$default(() => uuidv7()),
    activeFrom: timestamp('active_from').notNull(),
    name: text('name'),
    calories: integer('calories'),
    protein: integer('protein'),
    fats: integer('fats'),
    carbs: integer('carbs'),
    userId: uuid('user_id').notNull().references(() => users.id),
}, table => [
    index('target_active_from_user_id_idx').on(table.activeFrom, table.userId)
])