import {type Food, foods, zFood} from "./food-schema.js";
import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {db} from "../../data/db.js";


export const zPostFoodJson = zFood.pick({
    name: true,
    description: true,
    facts: true
});

export const postFoodHandler = async ({ json, c } : {
    json: z.infer<typeof zPostFoodJson>,
    c: Context<HonoType>
}) => {
    const userId = c.get('user')!.id;

    const [food] = await db.insert(foods).values({
        ...json,
        authorId: userId,
    }).returning();

    return c.json<Food>(food);
}