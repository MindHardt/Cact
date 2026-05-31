import {z} from "zod";

export const zNutritionalFact = z.number().nonnegative();
export const zNutritionalFacts = z.object({
    protein: zNutritionalFact,
    fats: zNutritionalFact,
    carbs: zNutritionalFact
});

export type NutritionalFacts = z.infer<typeof zNutritionalFacts>

const zNutritionalFactsNullish = z.object({
    protein: zNutritionalFact.nullish(),
    fats: zNutritionalFact.nullish(),
    carbs: zNutritionalFact.nullish()
})
export function calculateCalories(facts: z.infer<typeof zNutritionalFactsNullish>) {
    return ((facts.protein ?? 0) * 4) + ((facts.fats ?? 0) * 9) + ((facts.carbs ?? 0) * 4);
};

export const zDatetime =  z.union([
    z.iso.datetime({ offset: true }).pipe(z.coerce.date()),
    z.date()
]);