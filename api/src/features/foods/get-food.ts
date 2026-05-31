import { zFood } from "cact-shared/zFood.js";
import type { Context } from "hono";
import type z from "zod";
import { db } from "../../data/db.js";
import { foods } from "./food-schema.js";
import { eq } from "drizzle-orm";


export const zGetFoodParams = zFood.pick({
    id: true
});

export async function getFoodHandler({ c, params } : {
    c: Context,
    params: z.infer<typeof zGetFoodParams>
}) {

    const [upload] = await db
        .select()
        .from(foods)
        .where(eq(foods.id, params.id));

    return upload ? c.json(zFood.parse(upload)) : c.body(null, { status: 404 });

}