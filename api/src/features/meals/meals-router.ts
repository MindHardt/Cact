import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {requireAuthenticatedUser} from "../../auth/require-authenticated-user.js";
import {validator} from "hono-openapi";
import {getMealsHandler, zGetMealsQuery} from "./get-meals.js";
import {postMealHandler, zPostMealJson} from "./post-meal.js";
import {getMealHandler, zGetMealParams} from "./get-meal.js";
import {patchMealHandler, zPatchMealJson, zPatchMealParams} from "./patch-meal.js";
import {deleteMealHandler, zDeleteMealParams} from "./delete-meal.js";


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