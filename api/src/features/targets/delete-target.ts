import { zTarget } from "cact-shared/zTarget.js";
import type { Context } from "hono";
import type { HonoType } from "../../index.js";
import type z from "zod";
import { targets } from "./target-schema.js";
import { and, eq } from "drizzle-orm";
import { db } from "../../data/db.js";

export const zDeleteTargetParams = zTarget.pick({ 
    id: true 
});

export async function deleteTargetHandler({ c, params } : {
    c: Context<HonoType>,
    params: z.infer<typeof zDeleteTargetParams>
}) {
    
    const userId = c.get('user')!.id;
    const [deleted] = await db
        .delete(targets)
        .where(and(
            eq(targets.id, params.id), 
            eq(targets.userId, userId)
        ))
        .returning();

    return deleted ? c.body(null, { status: 204 }) : c.body(null, { status: 404 });
}