import {type Target} from "#/entities/target.ts";
import {useForm} from "@tanstack/react-form";
import {z} from "zod";
import {zNutritionFacts} from "#/entities/nutrition-facts.ts";
import {useNavigate} from "@tanstack/react-router";
import {pb} from "#/pb.ts";
import InputNutritionalFact from "#/components/input-nutritional-fact.tsx";
import {Button, ButtonGroup, Spinner} from "@heroui/react";
import {addMinutes, format} from "date-fns";
import BackButton from "#/components/back-button.tsx";
import {Calculator, Trash} from "lucide-react";
import {RootRoute} from "#/routes/__root.tsx";
import DaySelector from "#/components/day-selector.tsx";

const zValidator = z.object({
    id: z.string().optional(),
    activeFrom: z.date(),
    ...zNutritionFacts.shape
});
function calculateCalories(facts: { protein: number, carbs: number, fats: number }) {
    return (facts.protein * 4) + (facts.fats * 9) + (facts.carbs * 4);
}

export default function TargetForm({ target } : {
    target?: Target
}) {

    const { user } = RootRoute.useRouteContext();
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: zValidator.optional().parse(target) ?? {
            protein: 0,
            fats: 0,
            carbs: 0,
            calories: 0,
            activeFrom: new Date()
        },
        validators: {
            onMount: zValidator,
            onChange: zValidator
        },
        onSubmit: async ({ value: { id, ...body } }) => {
            if (id) {
                await pb.collection('targets').update(id, { ...body, user: user!.id });
            } else {
                await pb.collection('targets').create({ ...body, user: user!.id });
            }
            await navigate({ to: '/targets' });
        }
    })
    const onDelete = async () => {
        await pb.collection('targets').delete(target!.id);
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