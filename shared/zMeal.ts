import {z} from "zod";
import {zFood, zUnit} from "./zFood.js";
import {zDatetime, zNutritionalFacts} from "./extras.js";

export const zFoodPortion = z.object({
    food: zFood,
    unit: zUnit,
    count: z.number().positive()
});

export type FoodPortion = z.infer<typeof zFoodPortion>;

export const zMeal = z.object({
    id: z.uuid(),
    mealTime: zDatetime,
    note: z.string().nullable(),
    portions: z.array(zFoodPortion),
    nutrition: zNutritionalFacts,
    userId: z.uuid()
});