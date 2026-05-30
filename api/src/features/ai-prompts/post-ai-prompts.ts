import {aiPromptStatus, zAiPrompt} from "cact-shared/zAiPrompt.js";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {z} from "zod";
import {db} from "../../data/db.js";
import {aiPrompts} from "./ai-prompt-schema.js";
import {and, count, eq, gte, lte} from "drizzle-orm";
import {addDays} from "date-fns";
import {askAi} from "./ask-ai.js";

export const zPostAiPromptsJson = zAiPrompt.pick({
    text: true
});
const PROMPTS_PER_DAY = 10;

export async function postAiPromptsHandler({ c, json } : {
    c: Context<HonoType>,
    json: z.infer<typeof zPostAiPromptsJson>
}) {

    const userId = c.get('user')!.id;
    const now = new Date();
    const yesterday = addDays(now, -1);

    const [{ prompts }] = await db
        .select({ prompts: count(aiPrompts.id) })
        .from(aiPrompts)
        .where(and(
            eq(aiPrompts.userId, userId),
            gte(aiPrompts.createdAt, yesterday),
            lte(aiPrompts.createdAt, now)
        ));
    if (prompts >= PROMPTS_PER_DAY) {
        return c.body(null, { status: 429 })
    }

    const [prompt] = await db
        .insert(aiPrompts)
        .values({
            userId,
            status: aiPromptStatus.PENDING,
            ...json
        })
        .returning();

    let result;
    try {
        const items = await askAi(json.text);
        console.info('Received ai response', items);
        [result] = await db.update(aiPrompts)
            .set({
                items,
                respondedAt: new Date(),
                status: aiPromptStatus.SUCCESS
            })
            .where(eq(aiPrompts.id, prompt.id))
            .returning();
    } catch (e) {
        console.error('There was an error asking ai', e);
        [result] = await db.update(aiPrompts)
            .set({ status: aiPromptStatus.ERROR })
            .where(eq(aiPrompts.id, prompt.id))
            .returning();
    }

    return c.json(zAiPrompt.parse(result));
}