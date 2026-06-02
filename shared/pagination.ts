import {z} from "zod";


export const zPaginatedRequest = z.object({
    skip: z.coerce.number<string>().nonnegative().default(0),
    take: z.coerce.number<string>().nonnegative().default(24),
});

export function zPaginatedResponse<TSchema extends z.Schema>(zItem: TSchema) {
    return z.object({
        total: z.number().nonnegative(),
        data: z.array(zItem)
    }).readonly();
}

/**
 * @param page 1-based page number
 * @param pageSize amount of items per page
 */
export function pagination(page?: number, pageSize = 12) : z.input<typeof zPaginatedRequest> {
    return {
        skip: `${((page ?? 1) - 1) * pageSize}`,
        take: `${pageSize}`
    }
}

// Gets all items without pagination. Use with caution.
export function getAll() : z.input<typeof zPaginatedRequest> {
    return pagination(1, 65535);
}