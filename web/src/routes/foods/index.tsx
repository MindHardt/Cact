import {createFileRoute, useNavigate, useRouterState} from '@tanstack/react-router'
import {z} from "zod";
import {pb} from "#/pb.ts";
import {zFood} from "#/entities/food.ts";
import FoodCard from "#/components/food-card.tsx";
import NothingFound from "#/components/nothing-found.tsx";
import {useDebouncedCallback} from "@tanstack/react-pacer";
import {Input, Spinner} from "@heroui/react";

const zSearch = z.object({
    page: z.number().optional(),
    q: z.string().optional()
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
        : <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {foods.map(food => <FoodCard key={food.id} food={food} />)}
        </div>

    return <div className='flex flex-col gap-4'>
        <Input
            placeholder='Поиск...'
            defaultValue={q}
            onChange={e => setQ(e.target.value)}
        />
        {routerState.isLoading && <Spinner />}
        {SearchResult}
    </div>
}
