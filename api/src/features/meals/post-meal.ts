import { zMeal } from "cact-shared/zMeal.js";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {z} from "zod";
import {db} from "../../data/db.js";
import {meals} from "./meal-schema.js";

export const zPostMealJson = zMeal.pick({
    mealTime: true,
    note: true,
    portions: true,
    nutrition: true
});

export async function postMealHandler({ c, json } : {
    c: Context<HonoType>,
    json: z.infer<typeof zPostMealJson>
}) {

    const userId = c.get('user')!.id;
    const [meal] = await db
        .insert(meals)
        .values({
            userId,
            mealTime: json.mealTime,
            note: json.note,
            portions: json.portions,
            nutrition: json.nutrition
        })
        .returning();

    return c.json(zMeal.parse(meal));
}