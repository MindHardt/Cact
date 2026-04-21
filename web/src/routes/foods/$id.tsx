import {createFileRoute, useRouter} from '@tanstack/react-router'
import {pb} from "#/pb.ts";
import {zFood} from "#/entities/food.ts";
import {Button, Card, Surface} from "@heroui/react";

export const Route = createFileRoute('/foods/$id')({
  component: RouteComponent,
  loader: async ({ params: { id }}) => ({
    food: await pb.collection('foods').getOne(id).then(x => zFood.parse(x))
  })
})

function RouteComponent() {

  const { food } = Route.useLoaderData();
  const router = useRouter();

  return <Card className='text-center'>
    <Button className='mx-auto' onClick={() => router.history.back()}>
      Назад
    </Button>
    {food.image && (
        <div className='rounded-2xl overflow-hidden max-w-full flex justify-center items-center mx-auto'>
          <img className='max-w-full max-h-180' src={pb.files.getURL(food, food.image)} alt='' loading='lazy' />
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
