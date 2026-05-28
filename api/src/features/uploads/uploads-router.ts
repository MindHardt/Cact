import {Hono} from "hono";
import type {HonoType} from "../../index";
import {postUpload, zPostUploadsForm} from "./post-upload";
import {validator} from "hono-openapi";
import {getUpload, zGetUploadParams} from "./get-upload";
import {deleteUpload, zDeleteUploadParams} from "./delete-upload";
import {getUploads, zGetUploadsQuery} from "./get-uploads";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user";


export const uploadsRouter = new Hono<HonoType>()
    .get('/',
        validator('query', zGetUploadsQuery),
        c => getUploads({ c, query: c.req.valid('query') }))
    .get('/:id',
        validator('param', zGetUploadParams),
        c => getUpload({ c, params: c.req.valid('param') }))
    .post('/',
        validator('form', zPostUploadsForm),
        requireAuthenticatedUser,
        c => postUpload({ c, form: c.req.valid('form') }))
    .delete('/:id',
        validator('param', zDeleteUploadParams),
        requireAuthenticatedUser,
        c => deleteUpload({ c, params: c.req.valid('param') }))