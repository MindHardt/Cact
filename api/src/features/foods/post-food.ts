import {foods} from "./food-schema";
import {type Food, zFood} from "cact-shared/zFood";
import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index";
import {db} from "../../data/db";
import {uploads} from "../uploads/upload-schema";
import {eq} from "drizzle-orm";

export const zPostFoodJson = zFood.pick({
    name: true,
    description: true,
    facts: true,
    imageId: true,
    units: true
});

export const postFoodHandler = async ({ json, c } : {
    json: z.infer<typeof zPostFoodJson>,
    c: Context<HonoType>
}) => {
    const userId = c.get('user')!.id;

    if (json.imageId) {
        const [upload] = await db
            .select({ uploaderId: uploads.uploaderId })
            .from(uploads)
            .where(eq(uploads.id, json.imageId));
        if (!upload) {
            return c.body(null, { status: 404 });
        }
        if (upload.uploaderId != userId) {
            return c.body(null, { status: 403 });
        }
    }

    const [food] = await db.insert(foods).values({
        name: json.name,
        description: json.description,
        facts: json.facts,
        imageId: json.imageId,
        units: json.units,
        authorId: userId,
    }).returning();

    return c.json(zFood.parse(food));
}