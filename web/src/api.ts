import {z} from "zod";
import { hc } from "hono/client";
import type {ApiType} from "../../api/src";
import {createAuthClient} from "better-auth/react";

const { VITE_API_URL } = z.object({
    VITE_API_URL: z.url().nonempty()
}).parse(import.meta.env);

const { api } = hc<ApiType>(VITE_API_URL);
const auth = createAuthClient({
    baseURL: VITE_API_URL
});
export type Session = typeof auth.$Infer.Session['session'];
export type User = typeof auth.$Infer.Session['user'];

const uploadUrl = (uploadId: string) =>
    VITE_API_URL + '/api/uploads/' + uploadId;

export { api, auth, uploadUrl };