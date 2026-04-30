import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router'
import {pb} from "#/pb.ts";
import {z} from "zod";
import {addDays, addMilliseconds, formatRelative, set} from "date-fns";
import {
    Button,
    Card,
    Chip, Meter,
    Separator
} from "@heroui/react";
import {zMeal} from "#/entities/meal.ts";
import {ru} from "date-fns/locale";
import {Check, Cog, Plus} from "lucide-react";
import {type Target, zTarget} from "#/entities/target.ts";
import NothingFound from "#/components/nothing-found.tsx";
import DaySelector from "#/components/day-selector.tsx";
import type {NutritionFacts} from "#/entities/nutrition-facts.ts";
import NutritionalFactIcon, {type NutritionalFactName} from "#/components/nutritional-fact-icon.tsx";

const zSearch = z.object({
    day: z.iso.date().optional().catch(undefined)
})

export const Route = createFileRoute('/meals/')({
    beforeLoad: ({ context: { user }}) => {
        if (!user) {
            throw redirect({ to: '/' })
        }
    },
    component: RouteComponent,
    validateSearch: zSearch,
    loaderDeps: ({ search: { day }}) => ({ day }),
    loader: async ({ deps: { day }}) => {
        const from = set(day ? new Date(day) : new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        const to = addMilliseconds(addDays(from, 1), -1);
        return {
            meals: await pb.collection('meals').getFullList({
                filter: pb.filter(`mealTime >= {:from} && mealTime <= {:to}`, {
                    from, to
                }),
                sort: '+mealTime'
            }).then(x => x.map(m => zMeal.parse(m))),
            target: await pb.collection('targets').getFirstListItem(
                pb.filter('activeFrom <= {:now}', { now: new Date() }),
                {
                    sort: '+activeFrom'
                }
            ).then(x => zTarget.parse(x)).catch(e => {
                if ('status' in e && e.status === 404) {
                    return null;
                }
                throw e;
            })
        }
    }
})

function RouteComponent() {
    const { meals, target } = Route.useLoaderData();
    const { day } = Route.useSearch();
    const navigate = useNavigate({ from: '/meals/' });
    const setDay = async (day: string | undefined) => {
        await navigate({ to: '/meals', search: { day }});
    };
    const facts = meals
        .map(({ calories, protein, fats, carbs }) => ({
            calories, protein, fats, carbs
        }))
        .reduce((a, b) => ({
            calories: a.calories + b.calories,
            protein: a.protein + b.protein,
            fats: a.fats + b.fats,
            carbs: a.carbs + b.carbs
        }), { calories: 0, protein: 0, fats: 0, carbs: 0 });

    return <div className='flex flex-col gap-4 mx-auto'>
        <DaySelector day={day} setDay={setDay} />
        <Card>
            <Card.Header className='flex flex-row gap-2'>
                <Card.Title className='font-semibold text-lg text-center grow'>Статистика за день</Card.Title>
                <Link to='/targets'>
                    <Button size='sm'><Cog /></Button>
                </Link>
            </Card.Header>
            <Card.Content className='grid grid-cols-2 lg:grid-cols-4 gap-2'>
                <NutritionalFactDisplay target={target} facts={facts} fact='calories' />
                <NutritionalFactDisplay target={target} facts={facts} fact='protein' />
                <NutritionalFactDisplay target={target} facts={facts} fact='fats' />
                <NutritionalFactDisplay target={target} facts={facts} fact='carbs' />
            </Card.Content>
        </Card>
        <h2 className='text-center font-semibold text-lg'>Приёмы пищи</h2>
        <Separator />
        <div className='flex flex-col gap-4 px-2'>
            {meals.length > 0 ? meals.map(meal => (
                <Link key={meal.id} to='/meals/$id' params={{ id: meal.id }}>
                    <Card>
                        <Card.Content className='flex flex-row flex-wrap gap-2 items-center'>
                            <h2 className='text-lg font-semibold'>{meal.name}</h2>
                            {meal.calories !== 0 && <Chip><NutritionalFactIcon fact='calories' /> {meal.calories}</Chip>}
                            {meal.protein !== 0 && <Chip><NutritionalFactIcon fact='protein' /> {meal.protein}</Chip>}
                            {meal.fats !== 0 && <Chip><NutritionalFactIcon fact='fats' /> {meal.fats}</Chip>}
                            {meal.carbs !== 0 && <Chip><NutritionalFactIcon fact='carbs' /> {meal.carbs}</Chip>}
                            <Chip variant='secondary' className='ms-auto'>
                                {formatRelative(meal.mealTime, Date.now(), { locale: ru })}
                            </Chip>
                        </Card.Content>
                    </Card>
                </Link>
            )) : <NothingFound />}
            <Link to='/meals/add' className='px-5'>
                <Button className='w-full' variant='primary' size='lg'>
                    <Plus />
                </Button>
            </Link>
        </div>
    </div>
}

function NutritionalFactDisplay({ target, facts, fact } : {
    target: Target | null,
    facts: NutritionFacts,
    fact: NutritionalFactName
}) {
    const value = target ? facts[fact] / target[fact] * 100 : 100;
    const color = (105 >= value && 95 <= value)
        ? 'success'
        : value < 95 ? 'accent' : 'danger';

    return (
        <Chip className='flex-col gap-1 p-4'>
            <div className='flex flex-row gap-1 items-center'>
                <NutritionalFactIcon fact={fact} />
                <span className='whitespace-nowrap'>{`${Math.floor(facts[fact])} / ${target ? target[fact] : 0}`}</span>
                {color == 'success' && <Check color='var(--color-accent)' />}
            </div>
            <Meter color={color} className='gap-0' aria-label={fact}
                         value={value}>
                <Meter.Track className='bg-background-tertiary'>
                    <Meter.Fill />
                </Meter.Track>
            </Meter>
        </Chip>
    )
}
