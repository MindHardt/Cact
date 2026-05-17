import {Hono} from "hono";
import type {HonoType} from "../../index.js";
import {zValidator} from "@hono/zod-validator";
import {listFoodsHandler, zListFoodsQuery} from "./list-foods.js";


export const foodsRouter = new Hono<HonoType>()
    .get('/',
        zValidator('query', zListFoodsQuery),
        c => listFoodsHandler({ c, query: c.req.valid('query') }))