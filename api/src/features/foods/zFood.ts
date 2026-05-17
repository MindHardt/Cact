import {z} from "zod";
import {zNutritionalFacts} from "../../data/schemas/extras.js";


export const zFood = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    facts: zNutritionalFacts,
    authorId: z.uuid().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})