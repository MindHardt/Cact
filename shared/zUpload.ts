import {z} from "zod";
import {zDatetime, zUserId} from "./extras.js";

export const uploadScopes = {
    USER_AVATAR: 1,
    FOOD_IMAGE: 2,
} as const
export const uploadScopeNames = {
    1: 'USER_AVATAR',
    2: 'FOOD_IMAGE',
} as const satisfies Record<UploadScope, UploadScopeName>
export const zUploadScope = z.enum(uploadScopes);
export const zUploadScopeName = z.object(uploadScopes).keyof()
export type UploadScope = z.infer<typeof zUploadScope>;
export type UploadScopeName = z.infer<typeof zUploadScopeName>

export const zUploadId = z.uuid().brand<'UploadId'>();
export const zUpload = z.object({
    id: zUploadId,
    fileName: z.string(),
    contentType: z.string(),
    scope: z.union([
        zUploadScope.transform(x => uploadScopeNames[x]).pipe(zUploadScopeName),
        zUploadScopeName
    ]),
    size: z.number(),
    uploaderId: zUserId.nullable(),
    createdAt: zDatetime
});

export type Upload = z.infer<typeof zUpload>