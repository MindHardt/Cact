import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index";
import {zPaginatedRequest, zPaginatedResponse} from "cact-shared/pagination";
import {db} from "../../data/db";
import {meals} from "./meal-schema";
import {and, eq, lte, gte, count, ilike} from "drizzle-orm";
import { zMeal } from "cact-shared/zMeal";


export const zGetMealsQuery = zPaginatedRequest.extend({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    search: z.string().optional()
});
const zGetMealsResponse = zPaginatedResponse(zMeal);

export async function getMealsHandler({ query, c } : {
    c: Context<HonoType>
    query: z.infer<typeof zGetMealsQuery>
}) {
    const userId = c.get('user')!.id;
    const { from, to, search, skip, take } = query;
    if (from && to && from > to) {
        return c.json(zGetMealsResponse.parse({ total: 0, data: [] }))
    }

    const filter = and(
        eq(meals.userId, userId),
        from ? gte(meals.mealTime, from) : undefined,
        to ? lte(meals.mealTime, to) : undefined,
        search ? ilike(meals.note, `%${search}%`) : undefined
    );

    const [{ total }] = await db
        .select({ total: count(meals.id) })
        .from(meals)
        .where(filter);
    const data = await db
        .select()
        .from(meals)
        .where(filter)
        .orderBy(meals.mealTime)
        .offset(skip)
        .limit(take);

    return c.json(zGetMealsResponse.parse({ total, data }));
}