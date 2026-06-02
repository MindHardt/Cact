import { zFood } from "cact-shared/zFood.js";
import type { Context } from "hono";
import z from "zod";
import type { HonoType } from "../../index.js";
import { db } from "../../data/db.js";
import { foods } from "./food-schema.js";
import { and, eq } from "drizzle-orm";


export const zDeleteFoodParams = zFood.pick({
    id: true
});

export async function deleteFoodHandler({ c, params } : {
    c: Context<HonoType>,
    params: z.infer<typeof zDeleteFoodParams>
}) {

    const userId = c.get('user')!.id;
    const [deleted] = await db
        .delete(foods)
        .where(and(
            eq(foods.id, params.id),
            eq(foods.authorId, userId)
        ))
        .returning();


    return deleted ? c.body(null, { status: 204 }) : c.body(null, { status: 404 });
}