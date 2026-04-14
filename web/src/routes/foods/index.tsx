import {createFileRoute, useNavigate, useRouterState} from '@tanstack/react-router'
import {z} from "zod";
import {pb} from "#/pb.ts";
import {zFood} from "#/entities/food.ts";
import FoodCard from "#/components/food-card.tsx";
import NothingFound from "#/components/nothing-found.tsx";
import {useDebouncedCallback} from "@tanstack/react-pacer";
import {Button, InputGroup, Spinner} from "@heroui/react";
import NewFoodForm from "#/routes/foods/-form/new-food-form.tsx";
import {Search} from "lucide-react";

const zSearch = z.object({
    page: z.number().optional(),
    q: z.string().optional().transform(x => x && x.length > 0 ? x : undefined)
})

export const Route = createFileRoute('/foods/')({
    component: RouteComponent,
    validateSearch: zSearch,
    loaderDeps: ({ search: { page, q }}) => ({ page, q }),
    loader: async ({ deps: { page, q }}) => ({
        foods: await pb.collection('foods')
            .getList(page ?? 1, 12, {
                filter: `name ~ "${q ?? ''}"`
            }).then(x => x.items.map(i => zFood.parse(i)))
    })
})

function RouteComponent() {

    const navigate = useNavigate({ from: '/foods/' });
    const { foods } = Route.useLoaderData();
    const { q } = Route.useSearch();
    const routerState = useRouterState();
    const setQ = useDebouncedCallback(async (q: string) => {
        await navigate({ to: '/foods', search: { q }})
    }, { wait: 250 });

    const SearchResult = foods.length === 0
        ? <NothingFound />
        : <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {foods.map(food => <FoodCard key={food.id} food={food} />)}
        </div>

    return <div className='flex flex-col gap-4'>
        <InputGroup>
            <InputGroup.Input
                placeholder='Поиск...'
                defaultValue={q}
                onChange={e => setQ(e.target.value)}
            />
            <InputGroup.Suffix>
                <Button size='sm' variant='secondary'>
                    {routerState.isLoading ? <Spinner className='size-4' /> : <Search />}
                </Button>
                <NewFoodForm onCreated={() => navigate({ to: '.' })} />
            </InputGroup.Suffix>
        </InputGroup>
        {SearchResult}
    </div>
}
