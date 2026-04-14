import {zPbRecord} from "#/entities/pb-record.ts";
import {z} from "zod";


export const zUser = zPbRecord.extend({
    email: z.email(),
    name: z.string(),
    avatar: z.string().nullish(),
    created: z.coerce.date(),
    updated: z.coerce.date()
});
export type User = z.infer<typeof zUser>