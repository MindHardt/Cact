import {zPaginatedRequest, zPaginatedResponse} from "cact-shared/pagination.js";
import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {and, count, eq, ilike} from "drizzle-orm";
import {aiPrompts} from "./ai-prompt-schema.js";
import {db} from "../../data/db.js";
import {zAiPrompt} from "cact-shared/zAiPrompt.js";


export const zGetAiPromptsQuery = zPaginatedRequest.extend({
    search: z.string().optional()
});
const zGetAiPromptsResponse = zPaginatedResponse(zAiPrompt)

export async function getAiPromptsHandler({ c, query } : {
    c: Context<HonoType>,
    query: z.infer<typeof zGetAiPromptsQuery>
}) {

    const { search, skip, take } = query;
    const userId = c.get('user')!.id;
    const filter = and(
        eq(aiPrompts.userId, userId),
        search ? ilike(aiPrompts.text, `%${search}%`) : undefined
    )
    const [{ total }] = await db
        .select({ total: count(aiPrompts.id) })
        .from(aiPrompts)
        .where(filter);
    const data = await db
        .select()
        .from(aiPrompts)
        .where(filter)
        .orderBy(aiPrompts.id)
        .offset(skip)
        .limit(take);

    return c.json(zGetAiPromptsResponse.parse({ data, total }))
}