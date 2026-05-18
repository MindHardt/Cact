import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {postUpload, zPostUploadsForm} from "./post-upload.js";
import {validator} from "hono-openapi";
import {getUpload, zGetUploadParams} from "./get-upload.js";
import {deleteUpload, zDeleteUploadParams} from "./delete-upload.js";
import {getUploads, zGetUploadsQuery} from "./get-uploads.js";


export const uploadsRouter = new Hono<HonoType>()
    .post('/',
        validator('form', zPostUploadsForm),
        c => postUpload({ c, form: c.req.valid('form') }))
    .get('/:id',
        validator('param', zGetUploadParams),
        c => getUpload({ c, params: c.req.valid('param') }))
    .delete('/:id',
        validator('param', zDeleteUploadParams),
        c => deleteUpload({ c, params: c.req.valid('param') }))
    .get('/',
        validator('query', zGetUploadsQuery),
        c => getUploads({ c, query: c.req.valid('query') }))