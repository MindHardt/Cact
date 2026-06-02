import {z} from "zod";

export const zUserId = z.uuid().brand<'UserId'>();

export const zDatetime =  z.union([
    z.iso.datetime({ offset: true }).pipe(z.coerce.date()),
    z.date()
]);