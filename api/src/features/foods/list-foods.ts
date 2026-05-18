import {z} from "zod";
import {db} from "../../data/db.js";
import {foods, zFood} from "./food-schema.js";
import {count, like} from "drizzle-orm";
import type { Context } from "hono";
import {zPaginatedRequest, zPaginatedResponse} from "../../infra/pagination.js";

export const zListFoodsQuery = zPaginatedRequest.extend({
    search: z.string().optional()
})

export const listFoodsHandler = async ({ query, c } : {
    query: z.infer<typeof zListFoodsQuery>,
    c: Context
}) => {
    const { skip, take, search } = query;
    const filter = search ? like(foods.tags, `${search.toUpperCase()}%`) : undefined;

    const data = await db
        .select()
        .from(foods)
        .where(filter)
        .orderBy(foods.id)
        .offset(skip)
        .limit(take);
    const total = await db
        .select({ count: count() })
        .from(foods)
        .where(filter)
        .then(x => x[0].count)

    return c.json(zPaginatedResponse(zFood).parse({ data, total }));
};