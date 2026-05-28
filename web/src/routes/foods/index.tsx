import {createFileRoute, useNavigate, useRouterState} from '@tanstack/react-router'
import {z} from "zod";
import FoodCard from "#/components/food-card.tsx";
import NothingFound from "#/components/nothing-found.tsx";
import {useDebouncer} from "@tanstack/react-pacer";
import {Button, InputGroup} from "@heroui/react";
import NewFoodForm from "#/routes/foods/-form/new-food-form.tsx";
import {LoaderCircle, Search} from "lucide-react";
import {api} from "#/api.ts";
import {pagination, zPaginatedResponse} from "cact-shared/pagination.ts";
import {zFood} from "cact-shared/zFood.ts";

const zSearch = z.object({
    page: z.number().positive().optional(),
    q: z.string().optional().transform(x => x && x.length > 0 ? x : undefined)
})

export const Route = createFileRoute('/foods/')({
    component: RouteComponent,
    validateSearch: zSearch,
    loaderDeps: ({ search: { page, q }}) => ({ page, q }),
    loader: async ({ deps: { page, q }}) => ({
        foods: await api.foods.$get({ query: {
                search: q, ...pagination(page, 24)
            }})
            .then(x => x.json())
            .then(x => zPaginatedResponse(zFood).parse(x))
    })
})

function RouteComponent() {

    const navigate = useNavigate({ from: '/foods/' });
    const { foods } = Route.useLoaderData();
    const { q } = Route.useSearch();
    const routerState = useRouterState();
    const setQ = useDebouncer(
        async (q: string) => await navigate({ to: '/foods', search: { q }}),
        { wait: 250 },
    )

    const SearchResult = foods.total === 0
        ? <NothingFound />
        : <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {foods.data.map(food => <FoodCard withLink key={food.id} food={food} />)}
        </div>

    return <div className='flex flex-col gap-4'>
        <InputGroup>
            <InputGroup.Input
                placeholder='Поиск...'
                defaultValue={q}
                onChange={e => setQ.maybeExecute(e.target.value)}
            />
            <InputGroup.Suffix className='gap-1'>
                <Button size='sm' variant='secondary' onClick={() => setQ.flush()}>
                    {routerState.isLoading ? <LoaderCircle className='size-4 animate-spin' /> : <Search className='size-4' />}
                </Button>
                <NewFoodForm onCreated={() => navigate({ to: '.' })} />
            </InputGroup.Suffix>
        </InputGroup>
        {SearchResult}
    </div>
}
