import {z} from "zod";
import {zPaginatedRequest, zPaginatedResponse} from "cact-shared/pagination.js";
import {zTarget} from "cact-shared/zTarget.js";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {and, count, desc, eq, lte, ilike, gt} from "drizzle-orm";
import {targets} from "./target-schema.js";
import {db} from "../../data/db.js";
import {zQueryBool} from "../../infra/open-api.js";


export const zGetTargetsQuery = zPaginatedRequest.extend({
    search: z.string().optional(),
    active: zQueryBool.optional()
});

const zGetTargetsResponse = zPaginatedResponse(zTarget);

export async function getTargetsHandler({ c, query } : {
    c: Context<HonoType>,
    query: z.infer<typeof zGetTargetsQuery>
}) {

    const { skip, take, search, active } = query;
    const userId = c.get('user')!.id;
    const now = new Date();
    const filter = and(
        eq(targets.userId, userId),
        search ? ilike(targets.name, `%${search}%`) : undefined,
        active === true ? lte(targets.activeFrom, now) : undefined,
        active === false ? gt(targets.activeFrom, now) : undefined,
    );

    const [{ total }] = await db
        .select({ total: count(targets.id) })
        .from(targets)
        .where(filter);
    const data = await db
        .select()
        .from(targets)
        .where(filter)
        .orderBy(desc(targets.activeFrom), desc(targets.id))
        .offset(skip)
        .limit(take);

    return c.json(zGetTargetsResponse.parse({ total, data }));
}