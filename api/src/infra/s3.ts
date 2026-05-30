import {S3Client} from "@aws-sdk/client-s3";
import {z} from "zod";

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT, S3_BUCKET } = z.object({
    S3_ACCESS_KEY_ID: z.string().nonempty(),
    S3_SECRET_ACCESS_KEY: z.string().nonempty(),
    S3_ENDPOINT: z.url().nonempty(),
    S3_BUCKET: z.string().nonempty(),
}).parse(process.env);

export const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY
    },
    endpoint: S3_ENDPOINT,
    forcePathStyle: true
});
export const s3Bucket = S3_BUCKET;

export const s3Key = (uploadId: string) => `uploads/${uploadId}`;