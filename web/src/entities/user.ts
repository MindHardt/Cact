import {undefinedIfEmpty, zPbRecord} from "#/entities/pb-record.ts";
import {z} from "zod";
import {pb} from "#/pb.ts";
import type {FileOptions} from "pocketbase";


export const zUser = zPbRecord.extend({
    email: z.email(),
    name: z.string(),
    avatar: z.string().nullish().transform(undefinedIfEmpty),
    created: z.coerce.date(),
    updated: z.coerce.date()
});
export type User = z.infer<typeof zUser>;

export function avatarFallback(user: User) {
    return user.name
        .split(' ', 2)
        .map(x => x[0]?.toUpperCase() ?? '')
        .join('');
}
export function avatarSrc(user: User, opts?: FileOptions) : string {
    // @ts-expect-error to fix avatar changing dynamically
    return user.avatar ? pb.files.getURL(user, user.avatar, opts) : null;
}