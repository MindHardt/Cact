import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Button, ButtonGroup, Input, Spinner, Surface, TextArea } from "@heroui/react";
import InputFoodImage from "./input-food-image.tsx";
import InputNutritionalFact from "#/components/input-nutritional-fact.tsx";
import { api } from "#/api.ts";
import { zFood, type Food } from "cact-shared/zFood.js";
import { zUpload } from "cact-shared/zUpload.js";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Trash } from "lucide-react";
import InputUnit from "./input-unit.tsx";

const zValidator = zFood.pick({
    name: true,
    description: true,
    facts: true,
    units: true
}).extend({
    image: z.union([z.file(), z.uuid()]).nullable()
});
type ValidForm = z.infer<typeof zValidator>

const emptyForm: ValidForm = {
    name: "",
    description: null,
    facts: {
        protein: 0,
        fats: 0,
        carbs: 0
    },
    units: [{
        name: '100 грамм',
        multiplier: 1
    }],
    image: null
}

export default function FoodForm({ food, readonly }: {
    food?: Food
    readonly: boolean
}) {

    const initalValue = zValidator.parse({
        ...emptyForm,
        ...food,
        image: food?.imageId ?? null
    } satisfies ValidForm)
    const navigate = useNavigate();
    const form = useForm({
        validators: {
            onChange: zValidator,
            onSubmit: zValidator,
            onMount: zValidator
        },
        defaultValues: initalValue,
        onSubmit: async ({ value }) => {
            const imageId = value.image instanceof File
                ? await api.uploads.$post({ form: { scope: 'FOOD_IMAGE', file: value.image } })
                    .then(x => x.json())
                    .then(x => zUpload.parse(x).id)
                : value.image

            const json = { ...value, imageId };
            const { id } = await (food
                ? api.foods[':id'].$patch({ param: { id: food.id }, json })
                : api.foods.$post({ json })
            ).then(x => x.json()).then(x => zFood.parse(x))
            form.reset();
            await navigate({ to: '/foods/$id', params: { id } })
        }
    });
    const deleteFood = async () => {
        await api.foods[':id'].$delete({
            param: { id: food!.id }
        });
        await navigate({ to: '/foods' })
    }

    return (
        <form
            className=''
            onSubmit={async e => {
                e.preventDefault();
                e.stopPropagation();
                await form.handleSubmit();
            }}
        >
            <div className='flex flex-col gap-2 mx-2 mb-5'>
                <form.Field name='name'>
                    {field => (
                        <Input
                            readOnly={readonly}
                            placeholder='Название'
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                        />
                    )}
                </form.Field>
                <form.Field name='description'>
                    {field => (
                        <TextArea
                            readOnly={readonly}
                            placeholder='Примечания'
                            value={field.state.value ?? ''}
                            onChange={e => field.handleChange(e.target.value.length > 0 ? e.target.value : null)}
                        />
                    )}
                </form.Field>
                <Surface className='flex flex-col gap-1'>
                    <form.Field name='facts.protein'>
                        {field => (
                            <InputNutritionalFact readonly={readonly} withLetter field={{
                                name: 'protein',
                                state: field.state,
                                handleChange: x => field.handleChange(x ?? 0)
                            }} />
                        )}
                    </form.Field>
                    <form.Field name='facts.fats'>
                        {field => (
                            <InputNutritionalFact readonly={readonly} withLetter field={{
                                name: 'fats',
                                state: field.state,
                                handleChange: x => field.handleChange(x ?? 0)
                            }} />
                        )}
                    </form.Field>
                    <form.Field name='facts.carbs'>
                        {field => (
                            <InputNutritionalFact readonly={readonly} withLetter field={{
                                name: 'carbs',
                                state: field.state,
                                handleChange: x => field.handleChange(x ?? 0)
                            }} />
                        )}
                    </form.Field>
                </Surface>
                <form.Field name='image'>
                    {field => (
                        <InputFoodImage readonly={readonly} field={field} />
                    )}
                </form.Field>
                <form.Field name='units'>
                    {field => (
                        <Surface className='flex flex-col gap-2'>
                            <h2 className="font-semibold text-lg">Порции</h2>
                            <InputUnit readOnly unit={field.state.value[0]} setUnit={() => { }} onDelete={() => { }} />
                            {field.state.value.slice(1).map((x, i) => (
                                <InputUnit key={i} readOnly={readonly} unit={x}
                                    setUnit={x => field.handleChange(prev => {
                                        const result = [...prev];
                                        result[i + 1] = x;
                                        return result;
                                    })}
                                    onDelete={() => field.handleChange(prev => [...prev.slice(0, i + 1), ...prev.slice(i + 2)])}
                                />
                            ))}
                            {!readonly && (
                                <Button onClick={() => field.handleChange(prev => ([...prev, { name: '', multiplier: 1 }]))}>
                                    <Plus />
                                </Button>
                            )}
                        </Surface>
                    )}
                </form.Field>
            </div>
            {readonly === false && (
                <ButtonGroup className='w-full'>
                    <form.Subscribe selector={({ isValid, isSubmitting, isDefaultValue }) => ({ isValid, isSubmitting, isDefaultValue })}>
                        {({ isValid, isSubmitting, isDefaultValue }) => (
                            <Button className='w-full' size='lg' type='submit' isDisabled={!isValid || isSubmitting || isDefaultValue}>
                                {isSubmitting && <Spinner />}
                                {food ? 'Редактировать' : 'Создать'}
                            </Button>
                        )}
                    </form.Subscribe>
                    {food && (
                        <Button size='lg' variant='danger' onClick={deleteFood}>
                            <Trash />
                        </Button>
                    )}
                </ButtonGroup>
            )}
        </form>
    )
}
