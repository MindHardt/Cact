import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {db} from "../../data/db.js";
import {uploads} from "./upload-schema.js";
import { sql } from "drizzle-orm";
import {s3, s3Bucket} from "./s3.js";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";


export const zDeleteUploadParams = z.object({
    id: z.uuid()
});

export async function deleteUpload({ c, params } : {
    c: Context<HonoType>,
    params: z.infer<typeof zDeleteUploadParams>
}) {

    const [{ id }] = await db
        .delete(uploads)
        .where(sql`id = ${params.id}`)
        .returning({ id: uploads.id })
    if (!id) {
        return c.body(null, 404);
    }

    await s3.send(new DeleteObjectCommand({
        Key: `uploads/${id}`,
        Bucket: s3Bucket
    }));

    return c.body(null, 204);
}