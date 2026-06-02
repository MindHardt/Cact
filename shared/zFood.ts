import z from "zod";
import {zDatetime, zUserId} from "./extras.js";
import { zUploadId } from "./zUpload.js";
import { zNutritionalFacts } from "./zNutritionalFacts.js";

export const zUnit = z.object({
    name: z.string().nonempty(),
    multiplier: z.number().positive()
});

export type FoodUnit = z.infer<typeof zUnit>;

export const zFoodId = z.uuid().brand<'FoodId'>();
export const zFood = z.object({
    id: zFoodId,
    name: z.string(),
    description: z.string().nullable(),
    facts: zNutritionalFacts,
    authorId: zUserId.nullable(),
    imageId: zUploadId.nullable(),
    units: z.array(zUnit).nonempty(),
    createdAt: zDatetime,
    updatedAt: zDatetime
});

export type Food = z.infer<typeof zFood>;