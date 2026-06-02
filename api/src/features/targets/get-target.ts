import { zTarget } from "cact-shared/zTarget.js";
import type { Context } from "hono";
import z from "zod";
import type { HonoType } from "../../index.js";
import type { zGetMealParams } from "../meals/get-meal.js";
import { db } from "../../data/db.js";
import { targets } from "./target-schema.js";
import { and, eq } from "drizzle-orm";


export const zGetTargetParams = zTarget.pick({
    id: true
});

export async function getTargetHandler({ c, params } : {
    c: Context<HonoType>,
    params: z.infer<typeof zGetMealParams>
}) {

    const userId = c.get('user')!.id;
    const [target] = await db
        .select()
        .from(targets)
        .where(and(
            eq(targets.userId, userId),
            eq(targets.id, params.id)
        ));
    
    return target ? c.json(zTarget.parse(target)) : c.body(null, { status: 404 });

}