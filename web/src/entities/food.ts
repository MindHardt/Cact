import {undefinedIfEmpty, zPbRecord} from "#/entities/pb-record.ts";
import {z} from "zod";
import {zNutritionFacts} from "#/entities/nutrition-facts.ts";


export const zFood = zPbRecord.extend({
    name: z.string(),
    ...zNutritionFacts.shape,
    unit: z.string().nonempty(),
    description: z.string().optional().transform(undefinedIfEmpty),
    image: z.string().optional().transform(undefinedIfEmpty),
    author: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date()
});
export type Food = z.infer<typeof zFood>;