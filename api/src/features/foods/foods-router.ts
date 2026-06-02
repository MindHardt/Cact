import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {getFoodsHandler, zListFoodsQuery as zGetFoodsQuery} from "./get-foods.js";
import {validator} from "hono-openapi";
import {postFoodHandler, zPostFoodJson} from "./post-food.js";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user.js";
import { getFoodHandler, zGetFoodParams } from "./get-food.js";
import { patchFoodHandler, zPatchFoodJson, zPatchFoodParams } from "./patch-food.js";
import { deleteFoodHandler, zDeleteFoodParams } from "./delete-food.js";


export const foodsRouter = new Hono<HonoType>()
    .get('/',
        validator('query', zGetFoodsQuery),
        c => getFoodsHandler({ c, query: c.req.valid('query') }))
    .get('/:id',
        validator('param', zGetFoodParams),
        c => getFoodHandler({ c, params: c.req.valid('param') }))
    .post('/',
        requireAuthenticatedUser,
        validator('json', zPostFoodJson),
        c => postFoodHandler({ c, json: c.req.valid('json') }))
    .patch('/:id',
        requireAuthenticatedUser,
        validator('param', zPatchFoodParams),
        validator('json', zPatchFoodJson),
        c => patchFoodHandler({ c, params: c.req.valid('param'), json: c.req.valid('json') }))
    .delete('/:id',
        requireAuthenticatedUser,
        validator('param', zDeleteFoodParams),
        c => deleteFoodHandler({ c, params: c.req.valid('param') }))