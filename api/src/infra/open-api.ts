import {z} from "zod";

export const zQueryBool = z.enum(['true', 'false']).transform(x => z.stringbool().parse(x));