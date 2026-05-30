import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user.js";
import {validator} from "hono-openapi";
import {getTargetsHandler, zGetTargetsQuery} from "./get-targets.js";
import {postTargetsHandler, zPostTargetsJson} from "./post-targets.js";


export const targetsRouter = new Hono<HonoType>()
    .use('*', requireAuthenticatedUser)
    .get('/',
        validator('query', zGetTargetsQuery),
        c => getTargetsHandler({ c, query: c.req.valid('query') }))
    .post('/',
        validator('json', zPostTargetsJson),
        c => postTargetsHandler({ c, json: c.req.valid('json') }))