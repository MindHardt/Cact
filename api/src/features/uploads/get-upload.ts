import type {Context} from "hono";
import {z} from "zod";
import {s3, s3Bucket, s3Key} from "../../infra/s3.js";
import {GetObjectCommand} from "@aws-sdk/client-s3";
import {db} from "../../data/db.js";
import {uploads} from "./upload-schema.js";
import { sql } from "drizzle-orm";
import {zUpload} from "cact-shared/zUpload.js";

export const zGetUploadParams = zUpload.pick({
    id: true
});

export async function getUpload({ c, params } : {
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

    const blob = await s3.send(new GetObjectCommand({
        Key: s3Key(upload.id),
        Bucket: s3Bucket
    })).then(x => x.Body).catch(x => {
        if ("Code" in x && x.Code === "NoSuchKey") {
            return null;
        } else {
            throw x;
        }
    });

    if (!blob) {
        return c.body(null, 410);
    }

    return c.body(blob.transformToWebStream() as ReadableStream<Uint8Array>, 200, {
        "Content-Type": upload.contentType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(upload.fileName)}`,
        "Content-Length": upload.size.toString(),
        "Cache-Control": "public, immutable"
    });

}