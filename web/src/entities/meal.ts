import {z} from "zod";
import {undefinedIfEmpty, zPbRecord} from "#/entities/pb-record.ts";
import {zFood} from "#/entities/food.ts";
import {type NutritionFacts, zNutritionFacts} from "#/entities/nutrition-facts.ts";


export const zMeal = zPbRecord.extend({
    mealTime: z.coerce.date(),
    user: z.string(),
    name: z.string().nonempty(),
    ...zNutritionFacts.shape,
    comment: z.string().optional().transform(undefinedIfEmpty),
    foods: z.array(z.object({
        food: zFood,
        count: z.number().positive()
    })),
    created: z.coerce.date(),
    updated: z.coerce.date()
});
export type Meal = z.infer<typeof zMeal>;

export function calculateNutrition(foods: z.infer<typeof zMeal.shape.foods>): NutritionFacts {
    let [calories, protein, fats, carbs] = [0, 0, 0 ,0];
    for (const { food, count } of foods) {
        calories += food.calories * count;
        protein += food.protein * count;
        fats += food.fats * count;
        carbs += food.carbs * count;
    }
    return { calories, protein, fats, carbs };
}