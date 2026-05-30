import { zMeal } from "cact-shared/zMeal.js";
import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {db} from "../../data/db.js";
import {meals} from "./meal-schema.js";
import {and, eq} from "drizzle-orm";


export const zDeleteMealParams = zMeal.pick({
    id: true
});

export async function deleteMealHandler({ c, params } : {
    c: Context<HonoType>,
    params: z.infer<typeof zDeleteMealParams>
}) {

    const userId = c.get('user')!.id;
    const [affected] = await db
        .delete(meals)
        .where(and(eq(meals.id, params.id), eq(meals.userId, userId)))
        .returning({ id: meals.id });

    return affected
        ? c.body(null, { status: 204 })
        : c.body(null, { status: 404 });
}