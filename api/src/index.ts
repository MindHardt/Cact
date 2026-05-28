import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from "./auth/index";
import {authMiddleware, type UserContext} from "./infra/auth-middleware";
import {z} from "zod";
import { cors } from "hono/cors";
import {foodsRouter} from "./features/foods/foods-router";
import {uploadsRouter} from "./features/uploads/uploads-router";
import {Scalar} from "@scalar/hono-api-reference";
import {openAPIRouteHandler} from "hono-openapi";
import {autoMigrate} from "./data/db";
import {mealsRouter} from "./features/meals/meals-router";

const config = z.object({
  PORT: z.coerce.number().int().default(3001),
  CORS_ORIGINS: z.string().default('http://localhost:3000').transform(x => x.split(','))
}).parse(process.env);

export type HonoType = {
  Variables: UserContext
};
const app = new Hono<HonoType>();

if (process.env.NODE_ENV === "development") {
  app.get('/', c => c.redirect('/api/scalar'))
}

const api = app.basePath('/api')

api.use("*", cors({
  origin: config.CORS_ORIGINS,
  credentials: true
}))

api.use("*", authMiddleware)

api.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

api.get(
    '/openapi',
    openAPIRouteHandler(api, {
      documentation: {
        info: {
          title: 'Cact api',
          version: '1.0.0',
          description: 'Cact app main api',
        },
        servers: [
          { url: 'http://localhost:3001', description: 'Local Server' },
        ],
      },
    })
)

api.get('/scalar', Scalar({ url: '/api/openapi' }))

export const final = api
    .route('/foods', foodsRouter)
    .route('/uploads', uploadsRouter)
    .route('/meals', mealsRouter);
export type ApiType = typeof final;

await autoMigrate();

serve({
  fetch: final.fetch,
  port: config.PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
