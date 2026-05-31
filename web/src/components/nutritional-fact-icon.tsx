import {zNutritionFacts} from "#/entities/nutrition-facts.ts";
import type {ComponentProps, ReactElement} from "react";
import {CakeSlice, Drumstick, Hamburger, Zap} from "lucide-react";
import {Tooltip} from "@heroui/react";
import type z from "zod";

export const nutritionalFactNames = zNutritionFacts.keyof();
export type NutritionalFactName = z.infer<typeof nutritionalFactNames>;
type Props = ComponentProps<'svg'>;
const icons : Record<NutritionalFactName, (props: Props) => ReactElement> = {
    calories: props => <Zap {...props} />,
    protein: props => <Drumstick {...props} />,
    fats: props => <Hamburger {...props} />,
    carbs: props => <CakeSlice {...props} />
};
const names : Record<NutritionalFactName, string> = {
    calories: 'Калории',
    protein: 'Белки',
    fats: 'Жиры',
    carbs: 'Углеводы'
};

export default function NutritionalFactIcon({ fact, ...props } : {
    fact: NutritionalFactName
} & Props) {

    const Icon = icons[fact];
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <Icon {...props} />
            </Tooltip.Trigger>
            <Tooltip.Content>
                <Tooltip.Arrow />
                {names[fact]}
            </Tooltip.Content>
        </Tooltip>
    );
}