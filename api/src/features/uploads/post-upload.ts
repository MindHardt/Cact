import {z} from "zod";
import {uploads} from "./upload-schema";
import {uploadScopes, zUpload, zUploadScopeName} from "cact-shared/zUpload";
import {db} from "../../data/db";
import {s3, s3Bucket, s3Key} from "./s3";
import {Upload} from "@aws-sdk/lib-storage";
import type {Context} from "hono";
import type {HonoType} from "../../index";


export const zPostUploadsForm = z.object({
    file: z.file(),
    scope: zUploadScopeName
})

export async function postUpload({ c, form } : {
    c: Context<HonoType>,
    form: z.infer<typeof zPostUploadsForm>
}) {

    const { file, scope } = form;
    const userId = c.get('user')!.id;

    const [upload] = await db
        .insert(uploads)
        .values({
            uploaderId: userId,
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
            Key: s3Key(upload.id),
            ContentType: file.type,
            Body: file,
        }
    });
    await progress.done();

    return c.json(zUpload.parse(upload))
}