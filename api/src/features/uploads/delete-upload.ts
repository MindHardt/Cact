import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {db} from "../../data/db.js";
import {uploads} from "./upload-schema.js";
import { sql } from "drizzle-orm";
import {s3, s3Bucket, s3Key} from "./s3.js";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {zUpload} from "cact-shared/zUpload.js";


export const zDeleteUploadParams = zUpload.pick({
    id: true
});

export async function deleteUpload({ c, params } : {
    c: Context<HonoType>,
    params: z.infer<typeof zDeleteUploadParams>
}) {

    const userId = c.get('user')!.id;
    const [upload] = await db
        .delete(uploads)
        .where(sql`id = ${params.id}`)
        .returning({ id: uploads.id, uploaderId: uploads.uploaderId })
    if (!upload) {
        return c.body(null, 404);
    }
    if (upload.uploaderId !== userId) {
        return c.body(null, 403);
    }

    await s3.send(new DeleteObjectCommand({
        Key: s3Key(upload.id),
        Bucket: s3Bucket
    }));

    return c.body(null, 204);
}