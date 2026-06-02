import {foods} from "./food-schema.js";
import {zFood} from "cact-shared/zFood.js";
import {z} from "zod";
import type {Context} from "hono";
import type {HonoType} from "../../index.js";
import {db} from "../../data/db.js";
import {uploads} from "../uploads/upload-schema.js";
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