import type {zNutritionFacts} from "#/entities/nutrition-facts.ts";
import type {ComponentProps, ReactElement} from "react";
import {CakeSlice, Drumstick, Hamburger, Zap} from "lucide-react";


export type NutritionalFactName = keyof typeof zNutritionFacts.shape;
type Props = ComponentProps<'svg'>;
const icons : Record<NutritionalFactName, (props: Props) => ReactElement> = {
    calories: props => <Zap {...props} />,
    protein: props => <Drumstick {...props} />,
    fats: props => <Hamburger {...props} />,
    carbs: props => <CakeSlice {...props} />
};

export default function NutritionalFactIcon({ fact, ...props } : {
    fact: NutritionalFactName
} & Props) {

    const Icon = icons[fact];
    return <Icon {...props} />;

}