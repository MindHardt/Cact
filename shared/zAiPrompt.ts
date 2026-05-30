import {z} from "zod";
import {zNutritionalFacts} from "./extras.js";

export const zFoodItem = z.object({
    name: z.string(),
    comment: z.string().nullable(),
    facts: zNutritionalFacts.nullable()
});
export type FoodItem = z.infer<typeof zFoodItem>

export const aiPromptStatus = {
    PENDING: 0,
    SUCCESS: 1,
    ERROR: -1
} as const;
const aiPromptStatusNames = {
    '0': 'PENDING',
    '1': 'SUCCESS',
    '-1': 'ERROR'
} as const satisfies Record<AiPromptStatus, AiPromptStatusName>

export const zAiPromptStatus = z.enum(aiPromptStatus);
export const zAiPromptStatusName = z.object(aiPromptStatus).keyof();
export type AiPromptStatus = z.infer<typeof zAiPromptStatus>;
export type AiPromptStatusName = z.infer<typeof zAiPromptStatusName>;

export const zAiPrompt = z.object({
    id: z.uuid(),
    createdAt: z.coerce.date(),
    respondedAt: z.coerce.date().nullable(),
    text: z.string().nonempty(),
    status: zAiPromptStatus.transform(x => aiPromptStatusNames[x]).pipe(zAiPromptStatusName),
    items: z.array(zFoodItem).nullable()
});