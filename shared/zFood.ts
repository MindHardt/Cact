import z from "zod";
import {zNutritionalFacts} from "./extras.js";

export const zUnit = z.object({
    name: z.string().nonempty(),
    multiplier: z.number().positive().default(1)
});

export type FoodUnit = z.infer<typeof zUnit>;

export const zFood = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    facts: zNutritionalFacts,
    authorId: z.uuid().nullable(),
    imageId: z.uuid().nullable(),
    units: z.array(zUnit).nonempty(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
});

export type Food = z.infer<typeof zFood>;