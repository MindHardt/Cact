import {z} from "zod";
import {zDatetime, zUserId} from "./extras.js";

export const zTargetId = z.uuid().brand<'TargetId'>();
export const zTarget = z.object({
    id: zTargetId,
    userId: zUserId,
    activeFrom: zDatetime,
    name: z.string().nullable(),
    calories: z.number().nonnegative().nullable(),
    protein: z.number().nonnegative().nullable(),
    fats: z.number().nonnegative().nullable(),
    carbs: z.number().nonnegative().nullable()
});

export function isActive(target: Target) {
    return target.activeFrom < new Date();
}

export type Target = z.infer<typeof zTarget>