import {pgTable, text, timestamp, uuid, smallint, bigint} from "drizzle-orm/pg-core";
import {uuidv7} from "uuidv7";
import {users} from "../../data/schemas/auth-schema";
import type {UploadScope} from "cact-shared/zUpload";


export const uploads = pgTable('uploads', {
    id: uuid('id').primaryKey().$default(() => uuidv7()),
    fileName: text('file_name').notNull(),
    contentType: text('content_type').notNull(),
    scope: smallint('scope').notNull().$type<UploadScope>(),
    size: bigint({ mode: 'number' }).notNull(),
    uploaderId: uuid('uploader_id').references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp('created_at').defaultNow(),
})