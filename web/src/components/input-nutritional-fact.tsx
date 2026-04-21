import NutritionalFactIcon, {type NutritionalFactName} from "#/components/nutritional-fact-icon.tsx";
import {InputGroup} from "@heroui/react";

const factLetters: Record<NutritionalFactName, string> = {
    calories: 'К',
    protein: 'Б',
    fats: 'Ж',
    carbs: 'У'
}

export default function InputNutritionalFact({ field, withLetter } : {
    withLetter?: boolean,
    field: {
        name: NutritionalFactName,
        state: { value: number },
        handleChange: (value: number) => void
    }
}) {

    return <InputGroup className='w-full'>
        <InputGroup.Prefix className={'gap-1 items-center' + (withLetter ? ' w-16' : '')}>
            <NutritionalFactIcon fact={field.name} />
            {withLetter && <span className='font-semibold text-lg'>{factLetters[field.name]}</span>}
        </InputGroup.Prefix>
        <InputGroup.Input
            name={field.name}
            type='number'
            min='0'
            step='0.1'
            value={field.state.value}
            onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
        />
    </InputGroup>

}