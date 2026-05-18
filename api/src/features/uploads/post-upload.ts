import {z} from "zod";
import {uploads, uploadScopes, zUpload, zUploadScope, zUploadScopeName} from "./upload-schema.js";
import {db} from "../../data/db.js";
import {s3, s3Bucket} from "./s3.js";
import {Upload} from "@aws-sdk/lib-storage";
import type {Context} from "hono";


export const zPostUploadsForm = z.object({
    file: z.file(),
    scope: zUploadScopeName
})

export async function postUpload({ c, form } : {
    c: Context,
    form: z.infer<typeof zPostUploadsForm>
}) {

    const { file, scope } = form;

    const [upload] = await db
        .insert(uploads)
        .values({
            scope: uploadScopes[scope],
            size: file.size,
            fileName: file.name,
            contentType: file.type
        })
        .returning();

    const progress = new Upload({
        client: s3,
        params: {
            Bucket: s3Bucket,
            Key: `uploads/${upload.id}`,
            ContentType: file.type,
            Body: file,
        }
    });
    await progress.done();

    return c.json(zUpload.parse(upload))
}