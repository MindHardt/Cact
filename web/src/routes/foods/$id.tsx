import {createFileRoute, useRouter} from '@tanstack/react-router'
import {Button, Card, Surface} from "@heroui/react";
import { api, interceptNotFound, uploadUrl } from '#/api';
import { zFood } from 'cact-shared/zFood.js';

export const Route = createFileRoute('/foods/$id')({
  component: RouteComponent,
  loader: async ({ params: { id }}) => ({
    food: await api.foods[':id'].$get({ param: { id }})
    .then(interceptNotFound)
    .then(x => x.json())
    .then(x => zFood.parse(x))
  })
})

function RouteComponent() {

  const { food } = Route.useLoaderData();
  const router = useRouter();

  return <Card className='text-center'>
    <Button className='mx-auto' onClick={() => router.history.back()}>
      Назад
    </Button>
    {food.imageId && (
        <div className='rounded-2xl overflow-hidden max-w-full flex justify-center items-center mx-auto'>
          <img className='max-w-full max-h-180' src={uploadUrl(food.imageId)} alt='' loading='lazy' />
        </div>
    )}
    <Card.Header>
      <Card.Title className='text-2xl'>{food.name}</Card.Title>
    </Card.Header>
    {food.description && (
        <Surface variant='tertiary' className='rounded-2xl p-5'>
          <p>{food.description}</p>
        </Surface>
    )}
  </Card>
}
