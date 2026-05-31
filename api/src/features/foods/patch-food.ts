import { zFood } from "cact-shared/zFood.js";
import type { Context } from "hono";
import type { HonoType } from "../../index.js";
import type z from "zod";
import { db } from "../../data/db.js";
import { foods } from "./food-schema.js";
import { and, eq } from "drizzle-orm";


export const zPatchFoodParams = zFood.pick({ 
    id: true 
});

export const zPatchFoodJson = zFood.pick({
    name: true,
    description: true,
    facts: true,
    imageId: true,
    units: true
}).partial();

export async function patchFoodHandler({ c, params, json } : {
    c: Context<HonoType>,
    params: z.infer<typeof zPatchFoodParams>,
    json: z.infer<typeof zPatchFoodJson>
}) {
    
    const userId = c.get('user')!.id;
    const [updated] = await db
        .update(foods)
        .set({
            ...json,
            updatedAt: new Date()
        })
        .where(and(
            eq(foods.id, params.id),
            eq(foods.authorId, userId)
        ))
        .returning();

    return updated ? c.json(zFood.parse(updated)) : c.body(null, { status: 404 });
}