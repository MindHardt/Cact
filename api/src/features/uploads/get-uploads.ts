import {zPaginatedRequest, zPaginatedResponse} from "../../infra/pagination.js";
import {z} from "zod";
import type {Context} from "hono";
import {db} from "../../data/db.js";
import {uploads, zUpload} from "./upload-schema.js";
import {ilike, eq, and, count} from "drizzle-orm";

export const zGetUploadsQuery = zPaginatedRequest.extend({
    search: z.string().optional(),
    contentType: z.string().optional()
})

export async function getUploads({ c, query } : {
    c: Context,
    query: z.infer<typeof zGetUploadsQuery>
}) {

    const { search, contentType, skip, take } = query;
    const filter = and(
        search ? ilike(uploads.fileName, `%${search}%`) : undefined,
        contentType ? ilike(uploads.contentType, contentType.replace('*', '%')) : undefined
    )

    const [{ total }] = await db
        .select({ total: count() })
        .from(uploads)
        .where(filter)
    const data = await db
        .select()
        .from(uploads)
        .where(filter)
        .offset(skip)
        .limit(take);

    return c.json(zPaginatedResponse(zUpload).parse({ data, total }))
}