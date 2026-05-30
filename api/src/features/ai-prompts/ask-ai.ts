import fs from "node:fs/promises";
import {ai} from "../../infra/ai.js";
import {z} from "zod";
import {type FoodItem, zFoodItem} from "cact-shared/zAiPrompt.js";


const zOpenAiSchema = z.strictObject({
    items: z.array(zFoodItem)
});
const zOpenAiResponse = z.object({
    output: z.array(z.object({
        content: z.array(z.object({
            text: z.string().transform(x => JSON.parse(x)).pipe(zOpenAiSchema)
        }))
    }))
})

export async function askAi(prompt: string) : Promise<FoodItem[]> {
    const instructionsPath = new URL('./instructions.md', import.meta.url);
    const instructions = await fs.readFile(instructionsPath, { encoding: 'utf8' });

    const res = await ai.responses.create({
        model: 'openai/gpt-5.4-nano',
        instructions,
        input: prompt,
        text: {
            format: {
                type: 'json_schema',
                name: 'food_items',
                strict: true,
                schema: zOpenAiSchema.toJSONSchema()
            }
        }
    });
    if (res.error) {
        throw res.error;
    }

    return zOpenAiResponse.parse(res).output[0].content[0].text.items;
}