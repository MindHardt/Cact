import {pgTable, text, timestamp, uuid, smallint, bigint} from "drizzle-orm/pg-core";
import {uuidv7} from "uuidv7";
import {users} from "../../data/schemas/auth-schema.js";
import {z} from "zod";


export const uploads = pgTable('uploads', {
    id: uuid('id').primaryKey().$default(() => uuidv7()),
    fileName: text('file_name').notNull(),
    contentType: text('content_type').notNull(),
    scope: smallint('scope').notNull().$type<UploadScope>(),
    size: bigint({ mode: 'number' }).notNull(),
    uploaderId: uuid('uploader_id').references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp('created_at').defaultNow(),
})

export const uploadScopes = {
    userAvatar: 1,
    foodImage: 2,
} as const
export const uploadScopeNames : Record<UploadScope, UploadScopeName> = {
    1: 'userAvatar',
    2: 'foodImage',
}
export const zUploadScope = z.enum(uploadScopes);
export const zUploadScopeName = z.object(uploadScopes).keyof()
export type UploadScope = z.infer<typeof zUploadScope>;
export type UploadScopeName = z.infer<typeof zUploadScopeName>

export const zUpload = z.object({
    id: z.uuid(),
    fileName: z.string(),
    contentType: z.string(),
    scope: zUploadScope.transform(x => uploadScopeNames[x]).pipe(zUploadScopeName),
    size: z.number(),
    uploaderId: z.uuid().nullable(),
    createdAt: z.coerce.date()
})