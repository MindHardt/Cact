import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {postUpload, zPostUploadsForm} from "./post-upload.js";
import {validator} from "hono-openapi";
import {getUpload, zGetUploadParams} from "./get-upload.js";
import {deleteUpload, zDeleteUploadParams} from "./delete-upload.js";
import {getUploads, zGetUploadsQuery} from "./get-uploads.js";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user.js";


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