import {z} from "zod";


export const zPaginatedRequest = z.object({
    skip: z.coerce.number().nonnegative().default(0),
    take: z.coerce.number().nonnegative().default(24),
});

export function zPaginatedResponse<TSchema extends z.Schema>(zItem: TSchema) {
    return z.object({
        total: z.number().nonnegative(),
        data: z.array(zItem)
    }).readonly();
}

export type PaginatedResponse<T> = Readonly<{
    total: number,
    data: T[]
}>