import {z} from "zod";
import {zPbRecord} from "#/entities/pb-record.ts";
import {zNutritionFacts} from "#/entities/nutrition-facts.ts";


export const zTarget = zPbRecord.extend({
    activeFrom: z.coerce.date(),
    user: z.string(),
    ...zNutritionFacts.shape
});
export type Target = z.infer<typeof zTarget>;