import {OpenAI} from "openai";
import {z} from "zod";

const config = z.object({
    AI_BASE_URL: z.url(),
    AI_API_KEY: z.string().nonempty()
}).parse(process.env);

export const ai = new OpenAI({
    baseURL: config.AI_BASE_URL,
    apiKey: config.AI_API_KEY
});