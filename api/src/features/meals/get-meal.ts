import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {db} from "../../data/db.js";
import {meals} from "./meal-schema.js";
import {eq} from "drizzle-orm";
import { zMeal } from "cact-shared/zMeal.js";


export const zGetMealParams = z.object({
    id: z.uuid()
});

export async function getMealHandler({ c, params } : {
    c: Context<HonoType>,
    params: z.infer<typeof zGetMealParams>
}) {

    const userId = c.get('user')!.id;

    const [meal] = await db
        .select()
        .from(meals)
        .where(eq(meals.id, params.id));
    if (!meal || meal.userId !== userId) {
        return c.body(null, { status: 404 });
    }

    return c.json(zMeal.parse(meal));
}