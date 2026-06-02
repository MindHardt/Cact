import { zTarget } from "cact-shared/zTarget.js";
import type { Context } from "hono";
import z from "zod";
import type { HonoType } from "../../index.js";
import { db } from "../../data/db.js";
import { targets } from "./target-schema.js";
import { and, eq } from "drizzle-orm";

export const zPatchTargetParams = zTarget.pick({
    id: true
});

export const zPatchTargetJson = zTarget.pick({
    name: true,
    activeFrom: true,
    calories: true,
    protein: true,
    fats: true,
    carbs: true
}).partial();

export async function patchTargetHandler({ c, params, json } : {
    c: Context<HonoType>,
    params: z.infer<typeof zPatchTargetParams>,
    json: z.infer<typeof zPatchTargetJson>
}) {
    
    const userId = c.get('user')!.id;
    const [updated] = await db
        .update(targets)
        .set(json)
        .where(and(
            eq(targets.userId, userId),
            eq(targets.id, params.id)
        ))
        .returning();

    return updated ? c.json(zTarget.parse(updated)) : c.body(null, { status: 404 }); 
}