import {z} from "zod";

export const zPbRecord = z.object({
    id: z.string(),
    collectionId: z.string(),
    collectionName: z.string()
});
export type PbRecord = z.infer<typeof zPbRecord>;

export const undefinedIfEmpty = (s: string | undefined | null) =>
    s && s.length > 0 ? s : undefined;