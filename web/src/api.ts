import {z} from "zod";
import { hc } from "hono/client";
import type {ApiType} from "../../api/src";

export const { VITE_API_URL } = z.object({
    VITE_API_URL: z.string().nonempty()
}).parse(import.meta.env);

export const { api } = hc<ApiType>(VITE_API_URL);

api.foods.$get({ query: {} })