import {S3Client} from "@aws-sdk/client-s3";
import {z} from "zod";

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT, S3_BUCKET, S3_ENDPOINT_PUBLIC } = z.object({
    S3_ACCESS_KEY_ID: z.string().nonempty(),
    S3_SECRET_ACCESS_KEY: z.string().nonempty(),
    S3_ENDPOINT: z.url(),
    S3_BUCKET: z.string().nonempty(),
    S3_ENDPOINT_PUBLIC: z.url().optional()
}).parse(process.env);
const s3Params = {
    region: 'us-east-1',
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
}

export const s3 = new S3Client({
    ...s3Params,
    endpoint: S3_ENDPOINT,
});
export const s3Public = new S3Client({
    ...s3Params,
    endpoint: S3_ENDPOINT_PUBLIC ?? S3_ENDPOINT
});

export const s3Bucket = S3_BUCKET;

export const s3Key = (uploadId: string) => `uploads/${uploadId}`;