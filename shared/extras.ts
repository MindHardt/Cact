import {z} from "zod";

export const zNutritionalFacts = z.object({
    protein: z.number().nonnegative(),
    fats: z.number().nonnegative(),
    carbs: z.number().nonnegative()
});

export type NutritionalFacts = z.infer<typeof zNutritionalFacts>

export function calculateCalories(facts: NutritionalFacts) {
    return (facts.protein * 4) + (facts.fats * 9) + (facts.carbs * 4);
}