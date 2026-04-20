import {z} from "zod";


export const zNutritionFacts = z.object({
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    fats: z.number().nonnegative(),
    carbs: z.number().nonnegative()
});
export type NutritionFacts = z.infer<typeof zNutritionFacts>;