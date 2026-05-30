import { zMeal } from "cact-shared/zMeal.js";
import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {db} from "../../data/db.js";
import {meals} from "./meal-schema.js";
import {and, eq} from "drizzle-orm";


export const zPatchMealParams = zMeal.pick({
    id: true
});

export const zPatchMealJson = zMeal.pick({
    mealTime: true,
    note: true,
    portions: true,
    nutrition: true
}).partial();

export async function patchMealHandler({ c, params, json } : {
    c: Context<HonoType>,
    params: z.infer<typeof zPatchMealParams>,
    json: z.infer<typeof zPatchMealJson>
}) {

    const userId = c.get('user')!.id;

    const [updated] = await db
        .update(meals)
        .set(json)
        .where(and(eq(meals.id, params.id), eq(meals.userId, userId)))
        .returning();

    return updated ? c.json(zMeal.parse(updated)) : c.body(null, { status: 404 });
}