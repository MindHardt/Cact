import {zPaginatedRequest, zPaginatedResponse} from "../../infra/pagination.js";
import {z} from "zod";
import type {Context} from "hono";
import {db} from "../../data/db.js";
import {uploads, uploadScopes, zUpload, zUploadScopeName} from "./upload-schema.js";
import {ilike, eq, and, count} from "drizzle-orm";

export const zGetUploadsQuery = zPaginatedRequest.extend({
    search: z.string().optional(),
    contentType: z.string().optional(),
    scope: zUploadScopeName.optional()
})

export async function getUploads({ c, query } : {
    c: Context,
    query: z.infer<typeof zGetUploadsQuery>
}) {

    const { search, contentType, scope, skip, take } = query;
    const filter = and(
        search ? ilike(uploads.fileName, `%${search}%`) : undefined,
        contentType ? ilike(uploads.contentType, contentType.replace('*', '%')) : undefined,
        scope ? eq(uploads.scope, uploadScopes[scope]) : undefined,
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