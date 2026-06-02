import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {validator} from "hono-openapi";
import {postAiPromptsHandler, zPostAiPromptsJson} from "./post-ai-prompts.js";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user.js";
import {getAiPromptsHandler, zGetAiPromptsQuery} from "./get-ai-prompts.js";


export const aiPromptsRouter = new Hono<HonoType>()
    .use('*', requireAuthenticatedUser)
    .get('/',
        validator('query', zGetAiPromptsQuery),
        c => getAiPromptsHandler({ c, query: c.req.valid('query') }))
    .post('/',
        validator('json', zPostAiPromptsJson),
        c => postAiPromptsHandler({ c, json: c.req.valid('json') }))