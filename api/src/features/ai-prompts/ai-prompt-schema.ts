import {index, jsonb, pgTable, smallint, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {uuidv7} from "uuidv7";
import type {AiPromptStatus, FoodItem} from "cact-shared/zAiPrompt.js";
import {users} from "../../data/schemas/auth-schema.js";


export const aiPrompts = pgTable('ai_prompts', {
    id: uuid('id').primaryKey().$default(() => uuidv7()),
    userId: uuid('user_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    respondedAt: timestamp('responded_at'),
    text: text('text').notNull(),
    status: smallint('status').notNull().$type<AiPromptStatus>(),
    items: jsonb('items').$type<FoodItem[]>()
}, table => [
    index('ai_prompts_user_id_created_at_idx').on(table.userId, table.createdAt),
])