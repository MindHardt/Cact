import { createFileRoute, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { z } from "zod";
import FoodCard from "#/components/food-card.tsx";
import NothingFound from "#/components/nothing-found.tsx";
import { useDebouncer } from "@tanstack/react-pacer";
import { Button, InputGroup, Pagination } from "@heroui/react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LoaderCircle, Lock, Plus, Search } from "lucide-react";
import { api } from "#/api.ts";
import { pagination, zPaginatedResponse } from "cact-shared/pagination.js";
import { zFood } from "cact-shared/zFood.js";
import { RootRoute } from '../__root';

const zSearch = z.object({
    page: z.number().positive().default(1),
    q: z.string().optional().transform(x => x && x.length > 0 ? x : undefined)
});
const PAGE_SIZE = 12;

export const Route = createFileRoute('/foods/')({
    component: RouteComponent,
    validateSearch: zSearch,
    loaderDeps: ({ search: { page, q } }) => ({ page, q }),
    loader: async ({ deps: { page, q } }) => ({
        foods: await api.foods.$get({
            query: {
                search: q, ...pagination(page, PAGE_SIZE)
            }
        })
            .then(x => x.json())
            .then(x => zPaginatedResponse(zFood).parse(x))
    })
})

function RouteComponent() {

    const navigate = useNavigate({ from: '/foods/' });
    const { user } = RootRoute.useRouteContext();
    const { foods } = Route.useLoaderData();
    const { q, page } = Route.useSearch();
    const routerState = useRouterState();
    const setQ = useDebouncer(
        async (q: string) => await navigate({ to: '/foods', search: prev => ({ ...prev, q, page: 1 }) }),
        { wait: 250 },
    );
    const totalPages = Math.ceil(foods.total / PAGE_SIZE);

    return <div className='flex flex-col gap-4'>
        <InputGroup>
            <InputGroup.Input
                placeholder='Поиск...'
                defaultValue={q}
                onChange={e => setQ.maybeExecute(e.target.value)}
            />
            <InputGroup.Suffix className='gap-2'>
                <span className='text-muted'>{foods.total}</span>
                <Button size='sm' variant='secondary' onClick={() => setQ.flush()}>
                    {routerState.isLoading ? <LoaderCircle className='size-4 animate-spin' /> : <Search className='size-4' />}
                </Button>
                {user ? (
                    <Link to='/foods/new'>
                        <Button size='sm'>
                            <Plus />
                        </Button>
                    </Link>
                ) : (
                    <Button size='sm' isDisabled>
                        <Lock />
                    </Button>
                )}
            </InputGroup.Suffix>
        </InputGroup>
        {foods.total === 0 ? (
            <NothingFound />
        ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {foods.data.map(food => <FoodCard withLink key={food.id} food={food} />)}
            </div>
        )}
        <Pagination>
            <Pagination.Content className='mx-auto bg-surface rounded-2xl'>
                <Pagination.Item>
                    <Pagination.Previous isDisabled={page === 1}>
                        <Link to='/foods' search={prev => ({ ...prev, page: 1 })}>
                            <ChevronsLeft />
                        </Link>
                    </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Item>
                    <Pagination.Previous isDisabled={page === 1}>
                        <Link to='/foods' search={prev => ({ ...prev, page: page - 1 })}>
                            <ChevronLeft />
                        </Link>
                    </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Summary>
                    {page} / {totalPages}
                </Pagination.Summary>
                <Pagination.Item>
                    <Pagination.Next isDisabled={page === totalPages}>
                        <Link to='/foods' search={prev => ({ ...prev, page: page + 1 })}>
                            <ChevronRight />
                        </Link>
                    </Pagination.Next>
                </Pagination.Item>
                <Pagination.Item>
                    <Pagination.Next isDisabled={page === totalPages}>
                        <Link to='/foods' search={prev => ({ ...prev, page: totalPages })}>
                            <ChevronsRight />
                        </Link>
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    </div>
}
