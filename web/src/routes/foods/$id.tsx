import { createFileRoute } from '@tanstack/react-router'
import { Card } from "@heroui/react";
import { api, interceptNotFound } from '#/api';
import { zFood } from 'cact-shared/zFood.js';
import FoodForm from './-form/food-form';
import { RootRoute } from '../__root';
import BackButton from '#/components/back-button';

export const Route = createFileRoute('/foods/$id')({
  component: RouteComponent,
  loader: async ({ params: { id } }) => ({
    food: await api.foods[':id'].$get({ param: { id } })
      .then(interceptNotFound)
      .then(x => x.json())
      .then(x => zFood.parse(x))
  })
})

function RouteComponent() {

  const { food } = Route.useLoaderData();
  const { user } = RootRoute.useRouteContext();

  return (
    <div className='flex flex-col gap-2'>
      <BackButton navigate={{ to: '/foods' }} />
      <Card className='text-center'>
        <Card.Content>
          <FoodForm food={food} readonly={user?.id !== food.authorId} />
        </Card.Content>
      </Card>
    </div>
  )
}
