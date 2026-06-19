import type { Context } from "hono";
import { z } from "zod";
import { s3Bucket, s3Key, s3Public } from "../../infra/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../../data/db.js";
import { uploads } from "./upload-schema.js";
import { sql } from "drizzle-orm";
import { zUpload } from "cact-shared/zUpload.js";

export const zGetUploadParams = zUpload.pick({
    id: true
});

export async function getUpload({ c, params }: {
    c: Context,
    params: z.infer<typeof zGetUploadParams>
}) {

    const [upload] = await db
        .select()
        .from(uploads)
        .where(sql`id = ${params.id}`);
    if (!upload) {
        return c.body(null, 404);
    }

    const url = await getSignedUrl(s3Public, new GetObjectCommand({
        Key: s3Key(upload.id),
        Bucket: s3Bucket,
        ResponseContentDisposition: `attachment; filename*=UTF-8''${upload.fileName}`
    }), {
        expiresIn: 360
    });
    if (!url) {
        return c.body(null, 410);
    }

    c.header('Cache-Control', 'max-age=300, public, immutable')
    return c.redirect(url, 302);

}