import {z} from "zod";
import {zDatetime, zUserId} from "./extras.js";
import { zNutritionalFacts } from "./zNutritionalFacts.js";

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

export const zAiPromptId = z.uuid().brand<'AiPromptId'>();
export const zAiPrompt = z.object({
    id: zAiPromptId,
    createdAt: zDatetime,
    userId: zUserId,
    respondedAt: zDatetime.nullable(),
    text: z.string().nonempty(),
    status: z.union([
        zAiPromptStatus.transform(x => aiPromptStatusNames[x]).pipe(zAiPromptStatusName),
        zAiPromptStatusName
    ]),
    items: z.array(zFoodItem).nullable()
});

export function getTotal(prompt: z.infer<typeof zAiPrompt>, fact: keyof z.infer<typeof zNutritionalFacts>) { 
    return prompt.items?.reduce((sum, item) => sum + (item.facts?.[fact] || 0), 0) || 0;
}