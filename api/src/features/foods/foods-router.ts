import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {listFoodsHandler, zListFoodsQuery} from "./list-foods.js";
import {validator} from "hono-openapi";
import {postFoodHandler, zPostFoodJson} from "./post-food.js";


export const foodsRouter = new Hono<HonoType>()
    .get('/',
        validator('query', zListFoodsQuery),
        c => listFoodsHandler({ c, query: c.req.valid('query') }))
    .post('/',
        validator('json', zPostFoodJson),
        c => postFoodHandler({ c, json: c.req.valid('json') }))