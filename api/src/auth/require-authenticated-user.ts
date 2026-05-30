import {type Context, type Next} from "hono";
import type {HonoType} from "../index.js";


export const requireAuthenticatedUser = (c: Context<HonoType>, next: Next) => {
    return c.get('user') ? next() : Promise.resolve(c.body(null, { status: 401 }));
}