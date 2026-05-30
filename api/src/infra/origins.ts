import {z} from "zod";


export const { ALLOWED_ORIGINS } = z.object({
    ALLOWED_ORIGINS: z.string().default('http://localhost:3000').transform(x => x.split(','))
}).parse(process.env);