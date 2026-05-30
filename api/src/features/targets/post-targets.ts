import {zTarget} from "cact-shared/zTarget.js";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {z} from "zod";
import {db} from "../../data/db.js";
import {targets} from "./target-schema.js";


export const zPostTargetsJson = zTarget.pick({
    activeFrom: true,
    name: true,
    calories: true,
    protein: true,
    fats: true,
    carbs: true
});

export async function postTargetsHandler({ c, json } : {
    c: Context<HonoType>,
    json: z.infer<typeof zPostTargetsJson>
}) {

    const userId = c.get('user')!.id;

    const [target] = await db
        .insert(targets)
        .values({
            userId,
            ...json
        })
        .returning();

    return c.json(zTarget.parse(target));
}