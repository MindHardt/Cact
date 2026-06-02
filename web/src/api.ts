import {z} from "zod";
import { hc, type ClientResponse } from "hono/client";
import type {ApiType} from "../../api/src";
import {createAuthClient} from "better-auth/react";
import { notFound } from "@tanstack/react-router";
import type { Upload } from "cact-shared/zUpload.js";

const { VITE_API_URL } = z.object({
    VITE_API_URL: z.url().nonempty()
}).parse(import.meta.env);

export const { api } = hc<ApiType>(VITE_API_URL, {
    init: {
        credentials: "include"
    }
});
export const auth = createAuthClient({
    baseURL: VITE_API_URL
});
export type Session = typeof auth.$Infer.Session['session'];
export type User = typeof auth.$Infer.Session['user'];

export function uploadUrl(uploadId: string | Upload) : string {
    const id = typeof uploadId === 'object' ? uploadId.id : uploadId;
    return api.uploads[':id'].$url({ param: { id }}).href;
}

export function interceptNotFound<TResponse extends ClientResponse<any, any, any>>(res: TResponse) : TResponse {
    if (res.status === 404) {
        throw notFound();
    } else {
        return res;
    }
}``