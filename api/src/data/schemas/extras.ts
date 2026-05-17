import {z} from "zod";


export const zNutritionalFacts = z.object({
    protein: z.number().min(0),
    fats: z.number().min(0),
    carbs: z.number().min(0)
});

export type NutritionalFacts = z.infer<typeof zNutritionalFacts>