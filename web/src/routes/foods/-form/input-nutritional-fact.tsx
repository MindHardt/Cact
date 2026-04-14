import {InputGroup} from "@heroui/react";
import type {ReactNode} from "react";


export default function ImportNutritionalFact({ icon, letter, field } : {
    icon: ReactNode,
    letter: string,
    field: { state: { value: number }, handleChange: (value: number) => void }
}) {

    return  <InputGroup>
        <InputGroup.Prefix className='w-16 flex flex-row gap-1'>
            {icon}
            <span className='font-semibold'>{letter}</span>
        </InputGroup.Prefix>
        <InputGroup.Input
            min={0}
            step={1}
            value={field.state.value}
            onChange={e => field.handleChange(parseInt(e.target.value) || 0)}
        />
    </InputGroup>
}