import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    InputGroup,
    Modal,
    Spinner,
    Surface,
    TextArea
} from "@heroui/react";
import { Clock, Trash, TriangleAlert } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { addMinutes } from "date-fns";
import InputNutritionalFact from "#/components/input-nutritional-fact.tsx";
import FoodSelector from "#/routes/meals/-form/food-selector";
import AskAiModal from "#/routes/meals/-form/ask-ai-modal";
import { api } from "#/api";
import { zMeal, type Meal } from "cact-shared/zMeal.js";
import { getTotal } from "cact-shared/zAiPrompt.js";

const zValidator = zMeal.pick({
    nutrition: true,
    note: true,
    portions: true,
    mealTime: true
});

const emptyForm: z.infer<typeof zValidator> = {
    note: null,
    nutrition: {
        protein: 0,
        fats: 0,
        carbs: 0,
        calories: 0
    },
    portions: [],
    mealTime: new Date()
}

export default function MealForm({ meal }: {
    meal?: Meal
}) {

    const router = useRouter();
    const form = useForm({
        defaultValues: {
            ...emptyForm,
            ...meal
        } satisfies z.input<typeof zValidator> as z.input<typeof zValidator>,
        validators: {
            onMount: zValidator,
            onChange: zValidator
        },
        onSubmit: async ({ value }) => {
            const json = {
                ...value
            }
            if (meal) {
                await api.meals[':id'].$patch({ param: { id: meal.id }, json });
                router.history.back();
            } else {
                await api.meals.$post({ json });
                router.navigate({ to: '/meals' })
            }
        }
    });

    return <form onSubmit={async e => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
    }}>
        <Card>
            <CardContent>
                <form.Field name='note'>
                    {field => (
                        <TextArea
                            className='min-h-36'
                            placeholder='Заметка'
                            value={field.state.value ?? ''}
                            onChange={e => field.handleChange(e.target.value.length > 0 ? e.target.value : null)}
                        />
                    )}
                </form.Field>
            </CardContent>
            <CardContent>
                <Surface>
                    <form.Field name='portions'>
                        {field => <div className='flex flex-col gap-2'>
                            {field.state.value.map(({ food, count }, i) => (
                                <InputGroup className='justify-start'>
                                    <InputGroup.Prefix>
                                        {food.name}
                                    </InputGroup.Prefix>
                                    <div className='grow'></div>
                                    <InputGroup.Input
                                        type='number'
                                        step='0.1'
                                        min='0'
                                        className='grow-0 shrink'
                                        value={count}
                                        onChange={e => {
                                            const copy = [...field.state.value];
                                            copy[i] = { ...copy[i], count: parseFloat(e.target.value) };
                                            field.handleChange(copy);
                                        }}
                                    />
                                    <InputGroup.Suffix>
                                        <Button
                                            size='sm'
                                            variant='danger-soft'
                                            onClick={() => field.handleChange([
                                                ...field.state.value.slice(0, i - 1),
                                                ...field.state.value.slice(i, 0)
                                            ])}>
                                            <Trash />
                                        </Button>
                                    </InputGroup.Suffix>
                                </InputGroup>
                            ))}
                            <ButtonGroup className='w-full'>
                                <FoodSelector onSelected={(food) =>
                                    field.handleChange([...field.state.value, { food, unit: food.units[0], count: 1 }])}
                                />
                                <AskAiModal onResponseReceived={e => {
                                    form.setFieldValue('nutrition.protein', x => x + getTotal(e, 'protein'));
                                    form.setFieldValue('nutrition.fats', x => x + getTotal(e, 'fats'));
                                    form.setFieldValue('nutrition.carbs', x => x + getTotal(e, 'carbs'));
                                    form.setFieldValue('note', x => (x ?? '') + '\nРасчёт ИИ:\n' + e.items?.map(x => `${x.name}: ${x.comment ?? '✅'}`).join('\n'));
                                }} />
                            </ButtonGroup>
                        </div>}
                    </form.Field>
                </Surface>
            </CardContent>
            <CardContent>
                <div className='grid grid-cols-2 gap-2'>
                    <form.Field name='nutrition.calories'>
                        {field => <InputNutritionalFact withLetter 
                            field={{
                                name: 'calories',
                                state: field.state,
                                handleChange: x => field.handleChange(x ?? 0)
                            }}
                        />}
                    </form.Field>
                    <form.Field name='nutrition.protein'>
                        {field => <InputNutritionalFact withLetter 
                            field={{
                                name: 'protein',
                                state: field.state,
                                handleChange: x => field.handleChange(x ?? 0)
                            }}
                        />}
                    </form.Field>
                    <form.Field name='nutrition.fats'>
                        {field => <InputNutritionalFact withLetter 
                            field={{
                                name: 'fats',
                                state: field.state,
                                handleChange: x => field.handleChange(x ?? 0)
                            }}
                        />}
                    </form.Field>
                    <form.Field name='nutrition.carbs'>
                        {field => <InputNutritionalFact withLetter 
                            field={{
                                name: 'carbs',
                                state: field.state,
                                handleChange: x => field.handleChange(x ?? 0)
                            }}
                        />}
                    </form.Field>
                </div>
            </CardContent>
            <CardContent>
                <form.Field name='mealTime'>
                    {field => <>
                        <InputGroup>
                            <InputGroup.Prefix><Clock /></InputGroup.Prefix>
                            <InputGroup.Input
                                type='datetime-local'
                                value={addMinutes(field.state.value, -(new Date(field.state.value)).getTimezoneOffset()).toISOString().replace('Z', '')}
                                onChange={e => field.handleChange(new Date(e.target.value))}
                            />
                        </InputGroup>
                    </>}
                </form.Field>
            </CardContent>
            <CardContent>
                <ButtonGroup>
                    <form.Subscribe selector={({ isValid, isSubmitting, isDefaultValue }) => ([isValid, isSubmitting, isDefaultValue])}>
                        {([isValid, isSubmitting, isDefaultValue]) =>
                            <Button className='grow' size='lg' type='submit' isDisabled={!isValid || isSubmitting || isDefaultValue}>
                                {isSubmitting && <Spinner />}
                                Сохранить
                            </Button>}
                    </form.Subscribe>
                    {meal && (
                        <Modal>
                            <Button variant='danger' size='lg'>
                                <Trash />
                            </Button>
                            <Modal.Backdrop>
                                <Modal.Container>
                                    <Modal.Dialog>
                                        <Modal.CloseTrigger />
                                        <Modal.Header className='flex-row items-center'>
                                            <Modal.Icon className='bg-danger'><TriangleAlert /></Modal.Icon>
                                            <Modal.Heading>Предупреждение</Modal.Heading>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p>
                                                Вы уверены? Это действие необратимо!
                                            </p>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button
                                                variant='danger'
                                                slot="close"
                                                onClick={async () => {
                                                    await api.meals[':id'].$delete({ param: { id: meal.id } });
                                                    router.history.back();
                                                }}>
                                                Удалить
                                            </Button>
                                        </Modal.Footer>
                                    </Modal.Dialog>
                                </Modal.Container>
                            </Modal.Backdrop>
                        </Modal>
                    )}
                </ButtonGroup>
            </CardContent>
        </Card>
    </form>

}