import {z} from "zod";
import {zFood, zUnit} from "./zFood.js";
import {zDatetime, zUserId} from "./extras.js";
import { zNutritionalFact, zNutritionalFacts } from "./zNutritionalFacts.js";

export const zFoodPortion = z.object({
    food: zFood,
    unit: zUnit,
    count: z.number().positive()
});

export type FoodPortion = z.infer<typeof zFoodPortion>;

export const zMealId = z.uuid().brand<'MealId'>();
export const zMeal = z.object({
    id: zMealId,
    mealTime: zDatetime,
    note: z.string().nullable(),
    portions: z.array(zFoodPortion),
    nutrition: zNutritionalFacts.extend({
        calories: zNutritionalFact
    }),
    userId: zUserId
});
export type Meal = z.infer<typeof zMeal>;