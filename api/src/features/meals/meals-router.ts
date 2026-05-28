import {Hono} from "hono";
import type {HonoType} from "../../index";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user";
import {validator} from "hono-openapi";
import {getMealsHandler, zGetMealsQuery} from "./get-meals";
import {postMealHandler, zPostMealJson} from "./post-meal";
import {getMealHandler, zGetMealParams} from "./get-meal";
import {patchMealHandler, zPatchMealJson, zPatchMealParams} from "./patch-meal";
import {deleteMealHandler, zDeleteMealParams} from "./delete-meal";


export const mealsRouter = new Hono<HonoType>()
    .use('*', requireAuthenticatedUser)
    .get('/',
        validator('query', zGetMealsQuery),
        c => getMealsHandler({ c, query: c.req.valid('query') }))
    .get('/:id',
        validator('param', zGetMealParams),
        c => getMealHandler({ c, params: c.req.valid('param') }))
    .post('/',
        validator('json', zPostMealJson),
        c => postMealHandler({ c, json: c.req.valid('json') }))
    .patch('/:id',
        validator('param', zPatchMealParams),
        validator('json', zPatchMealJson),
        c => patchMealHandler({ c, params: c.req.valid('param'), json: c.req.valid('json') }))
    .delete('/:id',
        validator('param', zDeleteMealParams),
        c => deleteMealHandler({ c, params: c.req.valid('param') }));