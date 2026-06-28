import { Button, Input, InputGroup } from "@heroui/react";
import { zFood } from "cact-shared/zFood.js";
import { Asterisk, Trash, X } from "lucide-react";
import type z from "zod";

const zUnit = zFood.shape.units.unwrap();
type Unit = z.infer<typeof zUnit>;

export default function InputUnit({ readOnly, unit, setUnit, onDelete }: {
    readOnly?: boolean,
    unit: Unit,
    setUnit: (unit: Unit) => void,
    onDelete: () => void
}) {

    return (
        <div className="flex flex-row gap-1 w-full">
            <InputGroup isInvalid={unit.name.length === 0} className="grow">
                <InputGroup.Input
                    readOnly={readOnly}
                    placeholder="Порция"
                    value={unit.name}
                    onChange={e => setUnit({ ...unit, name: e.target.value })}
                />
            </InputGroup>
            <InputGroup isInvalid={unit.multiplier === 0}>
                <InputGroup.Prefix>
                    <X />
                </InputGroup.Prefix>
                <InputGroup.Input
                    className='shrink'
                    readOnly={readOnly}
                    type='number'
                    step={0.01}
                    min={0}
                    value={unit.multiplier}
                    onChange={e => setUnit({ ...unit, multiplier: parseFloat(e.target.value) })}
                />
                <InputGroup.Suffix className="w-16">
                    {!readOnly && (
                        <Button isIconOnly size="sm" variant="danger-soft" onClick={onDelete}>
                            <Trash className="size-4" />
                        </Button>
                    )}
                </InputGroup.Suffix>
            </InputGroup>
        </div>
    )

}