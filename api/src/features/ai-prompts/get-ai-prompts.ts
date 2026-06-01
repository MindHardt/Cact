import {zPaginatedRequest, zPaginatedResponse} from "cact-shared/pagination.js";
import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {and, count, desc, eq, gte, ilike, lte, inArray} from "drizzle-orm";
import {aiPrompts} from "./ai-prompt-schema.js";
import {db} from "../../data/db.js";
import {aiPromptStatus, zAiPrompt, zAiPromptStatusName} from "cact-shared/zAiPrompt.js";


export const zGetAiPromptsQuery = zPaginatedRequest.extend({
    search: z.string().optional(),
    status: zAiPromptStatusName.optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    ids: z.array(zAiPrompt.shape.id).optional()
});
const zGetAiPromptsResponse = zPaginatedResponse(zAiPrompt)

export async function getAiPromptsHandler({ c, query } : {
    c: Context<HonoType>,
    query: z.infer<typeof zGetAiPromptsQuery>
}) {

    const { search, skip, status, take, from, to, ids } = query;
    const userId = c.get('user')!.id;
    const filter = and(
        eq(aiPrompts.userId, userId),
        search ? ilike(aiPrompts.text, `%${search}%`) : undefined,
        status ? eq(aiPrompts.status, aiPromptStatus[status]) : undefined,
        from ? gte(aiPrompts.createdAt, from) : undefined,
        to ? lte(aiPrompts.createdAt, to) : undefined,
        ids ? inArray(aiPrompts.id, ids) : undefined
    );
    const [{ total }] = await db
        .select({ total: count(aiPrompts.id) })
        .from(aiPrompts)
        .where(filter);
    const data = await db
        .select()
        .from(aiPrompts)
        .where(filter)
        .orderBy(desc(aiPrompts.id))
        .offset(skip)
        .limit(take);

    return c.json(zGetAiPromptsResponse.parse({ data, total }))
}