import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user.js";
import {validator} from "hono-openapi";
import {getTargetsHandler, zGetTargetsQuery} from "./get-targets.js";
import {postTargetsHandler, zPostTargetsJson} from "./post-targets.js";
import { getTargetHandler, zGetTargetParams } from "./get-target.js";
import { patchTargetHandler, zPatchTargetJson, zPatchTargetParams } from "./patch-target.js";
import { deleteTargetHandler } from "./delete-target.js";


export const targetsRouter = new Hono<HonoType>()
    .use('*', requireAuthenticatedUser)
    .get('/',
        validator('query', zGetTargetsQuery),
        c => getTargetsHandler({ c, query: c.req.valid('query') }))
    .get('/:id',
        validator('param', zGetTargetParams),
        c => getTargetHandler({ c, params: c.req.valid('param') })
    )
    .post('/',
        validator('json', zPostTargetsJson),
        c => postTargetsHandler({ c, json: c.req.valid('json') }))
    .patch('/:id',
        validator('param', zPatchTargetParams),
        validator('json', zPatchTargetJson),
        c => patchTargetHandler({ c, params: c.req.valid('param'), json: c.req.valid('json') }))
    .delete('/:id',
        validator('param', zGetTargetParams),
        c => deleteTargetHandler({ c, params: c.req.valid('param') }))