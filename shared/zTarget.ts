import {z} from "zod";
import {zDatetime} from "./extras.js";

export const zTarget = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    activeFrom: zDatetime,
    name: z.string().nullable(),
    calories: z.number().nonnegative().nullable(),
    protein: z.number().nonnegative().nullable(),
    fats: z.number().nonnegative().nullable(),
    carbs: z.number().nonnegative().nullable()
});