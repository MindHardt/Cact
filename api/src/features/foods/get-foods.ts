import {z} from "zod";
import {db} from "../../data/db.js";
import {foods} from "./food-schema.js";
import {zFood} from "cact-shared/zFood.js";
import {and, count, eq, ilike} from "drizzle-orm";
import type { Context } from "hono";
import {zPaginatedRequest, zPaginatedResponse} from "cact-shared/pagination.js";
import { zQueryBool } from "../../infra/open-api.js";
import type { HonoType } from "../../index.js";

export const zListFoodsQuery = zPaginatedRequest.extend({
    search: z.string().optional(),
    mine: zQueryBool.optional()
})

export const getFoodsHandler = async ({ c, query } : {
    c: Context<HonoType>,
    query: z.infer<typeof zListFoodsQuery>
}) => {

    const userId = c.get('user')?.id
    const { skip, take, search, mine } = query;
    const filter = and(
        search ? ilike(foods.tags, `%${search.toUpperCase()}%`) : undefined,
        (mine && userId) ? eq(foods.authorId, userId) : undefined
    );

    const data = await db
        .select()
        .from(foods)
        .where(filter)
        .orderBy(foods.id)
        .offset(skip)
        .limit(take);
    const [{ total }] = await db
        .select({ total: count() })
        .from(foods)
        .where(filter)

    return c.json(zPaginatedResponse(zFood).parse({ data, total }));
};