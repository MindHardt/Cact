import {createFileRoute, Link} from '@tanstack/react-router'
import {pb} from "#/pb.ts";
import {z} from "zod";
import {addDays, addMilliseconds, formatRelative, set} from "date-fns";
import {Button, Card, CardContent, Chip, ProgressBar} from "@heroui/react";
import {zMeal} from "#/entities/meal.ts";
import {ru} from "date-fns/locale";
import {CakeSlice, Drumstick, Hamburger, Plus, Zap} from "lucide-react";
import {zTarget} from "#/entities/target.ts";

const zSearch = z.object({
    day: z.coerce.date().optional()
})

export const Route = createFileRoute('/meals/')({
    component: RouteComponent,
    validateSearch: zSearch,
    loaderDeps: ({ search: { day }}) => ({ day }),
    loader: async ({ deps: { day }}) => {
        const from = set(day ?? new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
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
    const facts = meals
        .map(({ calories, protein, fats, carbs }) => ({
            calories, protein, fats, carbs
        }))
        .reduce((a, b) => ({
            calories: a.calories + b.calories,
            protein: a.protein + b.protein,
            fats: a.fats + b.fats,
            carbs: a.carbs + b.carbs
        }));

    return <div className='flex flex-col gap-4 mx-auto'>
        <Card>
            <Card.Content className='grid grid-cols-2 lg:grid-cols-4 gap-2'>
                <Chip className='items-center gap-1'>
                    <Zap />
                    <span className='whitespace-nowrap'>{`${facts.calories} / ${target?.calories ?? 0}`}</span>
                    <ProgressBar className='gap-0' aria-label='Calories'
                                 value={target ? facts.calories / target.calories * 100 : 100}>
                        <ProgressBar.Track>
                            <ProgressBar.Fill />
                        </ProgressBar.Track>
                    </ProgressBar>
                </Chip>
                <Chip className='items-center gap-1'>
                    <Drumstick />
                    <span className='whitespace-nowrap'>{`${facts.protein} / ${target?.protein ?? 0}`}</span>
                    <ProgressBar className='gap-0' aria-label='Calories'
                                 value={target ? facts.protein / target.protein * 100 : 100}>
                        <ProgressBar.Track>
                            <ProgressBar.Fill />
                        </ProgressBar.Track>
                    </ProgressBar>
                </Chip>
                <Chip className='items-center gap-1'>
                    <Hamburger />
                    <span className='whitespace-nowrap'>{`${facts.fats} / ${target?.fats ?? 0}`}</span>
                    <ProgressBar className='gap-0' aria-label='Calories'
                                 value={target ? facts.fats / target.fats * 100 : 100}>
                        <ProgressBar.Track>
                            <ProgressBar.Fill />
                        </ProgressBar.Track>
                    </ProgressBar>
                </Chip>
                <Chip className='items-center gap-1'>
                    <CakeSlice />
                    <span className='whitespace-nowrap'>{`${facts.carbs} / ${target?.carbs ?? 0}`}</span>
                    <ProgressBar className='gap-0' aria-label='Calories'
                                 value={target ? facts.carbs / target.carbs * 100 : 100}>
                        <ProgressBar.Track>
                            <ProgressBar.Fill />
                        </ProgressBar.Track>
                    </ProgressBar>
                </Chip>
            </Card.Content>
        </Card>
        <div className='flex flex-col gap-4 px-2'>
            {meals.map(meal => (
                <Link key={meal.id} to='/meals/$id' params={{ id: meal.id }}>
                    <Card>
                        <CardContent className='flex flex-row flex-wrap gap-2 items-center'>
                            <h2 className='text-lg font-semibold'>{meal.name}</h2>
                            <Chip><Zap /> {meal.calories}</Chip>
                            <Chip><Drumstick /> {meal.protein}</Chip>
                            <Chip><Hamburger /> {meal.fats}</Chip>
                            <Chip><CakeSlice /> {meal.carbs}</Chip>
                            <Chip variant='secondary' className='ms-auto'>
                                {formatRelative(meal.mealTime, Date.now(), { locale: ru })}
                            </Chip>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            <Link to='/meals/add' className='px-5'>
                <Button className='w-full' variant='primary' size='lg'>
                    <Plus />
                </Button>
            </Link>
        </div>
    </div>
}
