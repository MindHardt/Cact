import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from "./auth/index.js";
import {authMiddleware, type UserContext} from "./auth/auth-middleware.js";
import { cors } from "hono/cors";
import {foodsRouter} from "./features/foods/foods-router.js";
import {uploadsRouter} from "./features/uploads/uploads-router.js";
import {Scalar} from "@scalar/hono-api-reference";
import {openAPIRouteHandler} from "hono-openapi";
import {autoMigrate} from "./data/db.js";
import {mealsRouter} from "./features/meals/meals-router.js";
import {aiPromptsRouter} from "./features/ai-prompts/ai-prompts-router.js";
import {targetsRouter} from "./features/targets/targets-router.js";
import {ALLOWED_ORIGINS} from "./infra/origins.js";

export type HonoType = {
  Variables: UserContext
};
const app = new Hono<HonoType>();

if (process.env.NODE_ENV === "development") {
  app.get('/', c => c.redirect('/api/scalar'))
}

const api = app.basePath('/api')

api.use("*", cors({
  origin: ALLOWED_ORIGINS,
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
    .get('/healthz', c => Promise.resolve(c.status(200)))
    .route('/foods', foodsRouter)
    .route('/uploads', uploadsRouter)
    .route('/meals', mealsRouter)
    .route('/ai-prompts', aiPromptsRouter)
    .route('/targets', targetsRouter);
export type ApiType = typeof final;

autoMigrate().then(() => serve({
  fetch: final.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
}));
