import {type Meal} from "#/entities/meal.ts";
import {useForm} from "@tanstack/react-form";
import {z} from "zod";
import {zNutritionFacts} from "#/entities/nutrition-facts.ts";
import {undefinedIfEmpty} from "#/entities/pb-record.ts";
import {zFood} from "#/entities/food.ts";
import {Button, ButtonGroup, Card, CardContent, CardHeader, InputGroup, Modal, Spinner, TextArea} from "@heroui/react";
import {CakeSlice, CaseSensitive, Clock, Drumstick, Hamburger, Trash, TriangleAlert, Zap} from "lucide-react";
import {pb} from "#/pb.ts";
import {RootRoute} from "#/routes/__root.tsx";
import {useRouter} from "@tanstack/react-router";
import {addMinutes} from "date-fns";

const zValidator = z.object({
    id: z.string().optional(),
    name: z.string().nonempty(),
    ...zNutritionFacts.shape,
    comment: z.string().optional().transform(undefinedIfEmpty),
    foods: z.array(z.object({
        food: zFood,
        count: z.number().positive()
    })),
    mealTime: z.coerce.date().default(() => new Date())
})
const emptyForm = () : z.infer<typeof zValidator> => ({
    name: '',
    comment: '',
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0,
    foods: [],
    mealTime: new Date()
})

export default function MealForm({ meal } : {
    meal?: Meal
}) {

    const { user } = RootRoute.useRouteContext();
    const router = useRouter();
    const form = useForm({
        defaultValues: meal ? zValidator.parse(meal) : emptyForm(),
        onSubmit: async ({ value }) => {
            const body = {
                ...value,
                user: user!.id
            }
            if (body.id) {
                await pb.collection('meals').update(body.id, body);
                router.history.back();
            } else {
                await pb.collection('meals').create(body);
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
            <CardHeader>
                <form.Field name='name'>
                    {field => (
                        <InputGroup>
                            <InputGroup.Prefix><CaseSensitive /></InputGroup.Prefix>
                            <InputGroup.Input
                                className='text-lg font-semibold'
                                placeholder='Обед'
                                value={field.state.value}
                                onChange={e => field.handleChange(e.target.value)}
                                />
                        </InputGroup>
                    )}
                </form.Field>
            </CardHeader>
            <CardContent>
                <form.Field name='comment'>
                    {field => (
                        <TextArea
                            placeholder='Комментарий'
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                        />
                    )}
                </form.Field>
            </CardContent>
            <CardContent>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-2'>
                    <form.Field name='calories'>
                        {field => (
                            <InputGroup>
                                <InputGroup.Prefix><Zap /></InputGroup.Prefix>
                                <InputGroup.Input
                                    min={0}
                                    step={1}
                                    value={field.state.value}
                                    onChange={e => field.handleChange(parseInt(e.target.value) || 0)}
                                />
                            </InputGroup>
                        )}
                    </form.Field>
                    <form.Field name='protein'>
                        {field => (
                            <InputGroup>
                                <InputGroup.Prefix><Drumstick /></InputGroup.Prefix>
                                <InputGroup.Input
                                    min={0}
                                    step={1}
                                    value={field.state.value}
                                    onChange={e => field.handleChange(parseInt(e.target.value) || 0)}
                                />
                            </InputGroup>
                        )}
                    </form.Field>
                    <form.Field name='fats'>
                        {field => (
                            <InputGroup>
                                <InputGroup.Prefix><Hamburger /></InputGroup.Prefix>
                                <InputGroup.Input
                                    min={0}
                                    step={1}
                                    value={field.state.value}
                                    onChange={e => field.handleChange(parseInt(e.target.value) || 0)}
                                />
                            </InputGroup>
                        )}
                    </form.Field>
                    <form.Field name='carbs'>
                        {field => (
                            <InputGroup>
                                <InputGroup.Prefix><CakeSlice /></InputGroup.Prefix>
                                <InputGroup.Input
                                    min={0}
                                    step={1}
                                    value={field.state.value}
                                    onChange={e => field.handleChange(parseInt(e.target.value) || 0)}
                                />
                            </InputGroup>
                        )}
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
                                value={addMinutes(field.state.value, -field.state.value.getTimezoneOffset()).toISOString().replace('Z', '')}
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
                    {form.state.values.id && (
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
                                                    await pb.collection('meals').delete(meal!.id);
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