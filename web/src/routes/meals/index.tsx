import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { endOfDay, formatRelative, startOfDay } from "date-fns";
import {
    Button,
    Card,
    Chip, Meter,
    Separator
} from "@heroui/react";
import { ru } from "date-fns/locale";
import { Check, Cog, Plus } from "lucide-react";
import NothingFound from "#/components/nothing-found.tsx";
import DaySelector from "#/components/day-selector.tsx";
import NutritionalFactIcon, { type NutritionalFactName } from "#/components/nutritional-fact-icon.tsx";
import { api } from "#/api";
import { getAll, zPaginatedResponse } from "cact-shared/pagination.js";
import { zMeal } from "cact-shared/zMeal.js";
import { zTarget, type Target } from "cact-shared/zTarget.js";
import type { NutritionalAndEnergyFacts } from "cact-shared/zNutritionalFacts.js";

const zSearch = z.object({
    day: z.iso.date().optional().catch(undefined)
})

export const Route = createFileRoute('/meals/')({
    beforeLoad: ({ context: { user } }) => {
        if (!user) {
            throw redirect({ to: '/' })
        }
    },
    component: RouteComponent,
    validateSearch: zSearch,
    loaderDeps: ({ search: { day } }) => ({ day }),
    loader: async ({ deps: { day } }) => {
        day ??= new Date().toISOString();
        return {
            meals: await api.meals.$get({
                query: {
                    from: startOfDay(day).toISOString(),
                    to: endOfDay(day).toISOString(),
                    ...getAll()
                }
            }).then(x => x.json()).then(x => zPaginatedResponse(zMeal).parse(x)),
            target: await api.targets.$get({
                query: {
                    active: 'true',
                    take: '1'
                }
            }).then(x => x.json()).then(x => zPaginatedResponse(zTarget).parse(x)).then(x => x.data[0] || null)
        }
    }
})

function RouteComponent() {
    const { meals, target } = Route.useLoaderData();
    const { day } = Route.useSearch();
    const navigate = useNavigate({ from: '/meals/' });
    const setDay = async (day: string | undefined) => {
        await navigate({ to: '/meals', search: { day } });
    };
    const facts = meals.data
        .map(x => x.nutrition)
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
                {target && (
                    <Link to='/targets/$id' params={{ id: target.id }}>
                        <Button size='sm'><Cog /></Button>
                    </Link>
                )}
            </Card.Header>
            <Card.Content className='flex flex-row gap-2 justify-between'>
                <NutritionalFactDisplay target={target} facts={facts} fact='calories' />
                <NutritionalFactDisplay target={target} facts={facts} fact='protein' />
                <NutritionalFactDisplay target={target} facts={facts} fact='fats' />
                <NutritionalFactDisplay target={target} facts={facts} fact='carbs' />
            </Card.Content>
        </Card>
        <h2 className='text-center font-semibold text-lg'>Приёмы пищи</h2>
        <Separator />
        <div className='flex flex-col gap-4 px-2'>
            {meals.data.length > 0 ? meals.data.map(meal => (
                <Link key={meal.id} to='/meals/$id' params={{ id: meal.id }}>
                    <Card>
                        <Card.Content className='flex flex-row flex-wrap gap-2 items-center'>
                            {meal.note && <h2 className='text-lg font-semibold'>{meal.note}</h2>}
                            {meal.nutrition.calories !== 0 && <Chip><NutritionalFactIcon fact='calories' /> {meal.nutrition.calories}</Chip>}
                            {meal.nutrition.protein !== 0 && <Chip><NutritionalFactIcon fact='protein' /> {meal.nutrition.protein}</Chip>}
                            {meal.nutrition.fats !== 0 && <Chip><NutritionalFactIcon fact='fats' /> {meal.nutrition.fats}</Chip>}
                            {meal.nutrition.carbs !== 0 && <Chip><NutritionalFactIcon fact='carbs' /> {meal.nutrition.carbs}</Chip>}
                            <Chip variant='secondary' className='ms-auto'>
                                {formatRelative(meal.mealTime, Date.now(), { locale: ru })}
                            </Chip>
                        </Card.Content>
                    </Card>
                </Link>
            )) : <NothingFound />}
            <Link to='/meals/new' className='px-5'>
                <Button className='w-full' variant='primary' size='lg'>
                    <Plus />
                </Button>
            </Link>
        </div>
    </div>
}

function NutritionalFactDisplay({ target, facts, fact }: {
    target: Target | null,
    facts: NutritionalAndEnergyFacts,
    fact: NutritionalFactName
}) {

    if (!target?.[fact]) {
        return <></>
    }

    const value = facts[fact] / target[fact] * 100;
    const color = (105 >= value && value >= 95)
        ? 'success'
        : value < 95 ? 'accent' : 'danger';

    return (
        <Chip className='flex-col gap-1 p-4 grow'>
            <div className='flex flex-row gap-1 items-center'>
                <NutritionalFactIcon fact={fact} />
                <span className='whitespace-nowrap'>{`${Math.round(facts[fact])} / ${target ? target[fact] : 0}`}</span>
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
