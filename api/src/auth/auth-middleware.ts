import type {Context, Next} from "hono";
import {auth} from "./index.js";

export type UserContext = {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
}

export async function authMiddleware(c: Context, next: Next) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (session) {
        c.set('user', session.user);
        c.set('session', session.session);
    } else {
        c.set('user', null);
        c.set('session', null)
    }

    await next();
}