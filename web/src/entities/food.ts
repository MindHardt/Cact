import {undefinedIfEmpty, zPbRecord} from "#/entities/pb-record.ts";
import {z} from "zod";


export const zFood = zPbRecord.extend({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    fats: z.number(),
    carbs: z.number(),
    unit: z.string().nonempty(),
    description: z.string().nullish().transform(undefinedIfEmpty),
    image: z.string().nullish().transform(undefinedIfEmpty),
    author: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date()
});
export type Food = z.infer<typeof zFood>;