import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from "./auth.js";
import {authMiddleware, type UserContext} from "./infra/auth-middleware.js";
import {z} from "zod";
import { cors } from "hono/cors";
import {foodsRouter} from "./features/foods/foods-router.js";

const config = z.object({
  PORT: z.coerce.number().int().default(3001),
  CORS_ORIGINS: z.string().default('http://localhost:3000').transform(x => x.split(','))
}).parse(process.env);

export type HonoType = {
  Variables: UserContext
};
const app = new Hono<HonoType>().basePath('/api')

app.use("*", cors({
  origin: config.CORS_ORIGINS,
  credentials: true
}))

app.use("*", authMiddleware)

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

let route = app.route('/foods', foodsRouter)

serve({
  fetch: app.fetch,
  port: config.PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export type ApiType = typeof route;
