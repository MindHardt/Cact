import {Hono} from "hono";
import type {HonoType} from "../../index";
import {listFoodsHandler, zListFoodsQuery} from "./get-foods";
import {validator} from "hono-openapi";
import {postFoodHandler, zPostFoodJson} from "./post-food";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user";


export const foodsRouter = new Hono<HonoType>()
    .get('/',
        validator('query', zListFoodsQuery),
        c => listFoodsHandler({ c, query: c.req.valid('query') }))
    .post('/',
        validator('json', zPostFoodJson),
        requireAuthenticatedUser,
        c => postFoodHandler({ c, json: c.req.valid('json') }))