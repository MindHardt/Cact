import {useForm} from "@tanstack/react-form";
import {z} from "zod";
import {useNavigate} from "@tanstack/react-router";
import {pb} from "#/pb.ts";
import InputNutritionalFact from "#/components/input-nutritional-fact.tsx";
import {Button, ButtonGroup, Input, Spinner} from "@heroui/react";
import {addMinutes, format} from "date-fns";
import BackButton from "#/components/back-button.tsx";
import {Calculator, Trash} from "lucide-react";
import {RootRoute} from "#/routes/__root.tsx";
import DaySelector from "#/components/day-selector.tsx";
import { calculateCalories, zNutritionalFact, zNutritionalFacts } from "cact-shared/extras.js";
import type { Target } from "cact-shared/zTarget.js";
import { api } from "#/api";

const zValidator = z.object({
    id: z.string().optional(),
    name: z.string().nullable(),
    activeFrom: z.date(),
    calories: zNutritionalFact.nullable(),
    protein: zNutritionalFact.nullable(),
    fats: zNutritionalFact.nullable(),
    carbs: zNutritionalFact.nullable()
});

export default function TargetForm({ target } : {
    target?: Target
}) {

    const navigate = useNavigate();
    const form = useForm({
        defaultValues: zValidator.optional().parse(target) ?? {
            id: undefined,
            name: null,
            protein: null,
            fats: null,
            carbs: null,
            calories: null,
            activeFrom: new Date()
        },
        validators: {
            onMount: zValidator,
            onChange: zValidator
        },
        onSubmit: async ({ value: { id, ...body } }) => {
            if (id) {
                await api.targets[':id'].$patch({ param: { id }, json: body })
            } else {
                await api.targets.$post({ json: body })
            }
            await navigate({ to: '/targets' });
        }
    })
    const onDelete = async () => {
        await api.targets[':id'].$delete({ param: { id: target!.id }});
        await navigate({ to: '/targets' });
    }

    return (
        <form
            className='flex flex-col gap-2'
            onSubmit={async e => {
                e.preventDefault();
                e.stopPropagation();
                await form.handleSubmit();
            }}>
            <BackButton />
            <form.Field name='name'>
                {field => (
                    <Input
                        placeholder="Название цели"
                        value={field.state.value ?? ''}
                        onChange={e => field.handleChange(e.target.value.length > 0 ? e.target.value : null)}
                    />
                )}
            </form.Field>
            <form.Field name='activeFrom'>
                {field => (
                    <DaySelector
                        day={format(field.state.value, 'yyyy-MM-dd')}
                        setDay={e => field.handleChange(addMinutes(new Date(e!), -new Date().getTimezoneOffset()))}
                    />
                )}
            </form.Field>
            <div className='grid grid-cols-2 gap-2'>
                <form.Field name='protein'>
                    {field => <InputNutritionalFact field={field} />}
                </form.Field>
                <form.Field name='fats'>
                    {field => <InputNutritionalFact field={field} />}
                </form.Field>
                <form.Field name='carbs'>
                    {field => <InputNutritionalFact field={field} />}
                </form.Field>
                <form.Field name='calories'>
                    {field => <InputNutritionalFact field={field} />}
                </form.Field>
            </div>
            <form.Subscribe selector={({ values: { protein, fats, carbs, calories }}) => ({ protein, fats, carbs, calories })}>
                {({ calories, ...others }) => (
                    <Button
                        className='mx-auto'
                        isDisabled={calories == calculateCalories(others)}
                        onClick={() => form.setFieldValue('calories', calculateCalories(others))}
                    >
                        <Calculator />
                        Посчитать калории
                    </Button>
                )}
            </form.Subscribe>
            <ButtonGroup>
                <form.Subscribe selector={({ isValid, isSubmitting, isDefaultValue }) => ([isValid, isSubmitting, isDefaultValue])}>
                    {([isValid, isSubmitting, isDefaultValue]) =>
                        <Button className='grow' size='lg' type='submit' isDisabled={!isValid || isSubmitting || isDefaultValue}>
                            {isSubmitting && <Spinner />}
                            Сохранить
                        </Button>}
                </form.Subscribe>
                {target && (
                    <Button size='lg' variant='danger' onClick={onDelete}>
                        <Trash />
                    </Button>
                )}
            </ButtonGroup>
        </form>
    )

}