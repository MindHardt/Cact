import {createFileRoute, redirect} from '@tanstack/react-router'
import {catchNotFound, pb} from "#/pb.ts";
import {zMeal} from "#/entities/meal.ts";
import MealForm from "#/routes/meals/-components/meal-form.tsx";
import BackButton from "#/components/back-button.tsx";

export const Route = createFileRoute('/meals/$id')({
  beforeLoad: ({ context: { user }}) => {
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
  loader: async ({ params: { id }}) => ({
    meal: await pb.collection('meals').getOne(id)
        .then(x => zMeal.parse(x))
        .catch(catchNotFound)
  })
})

function RouteComponent() {
  const { meal } = Route.useLoaderData();

  return <>
    <BackButton />
    <MealForm meal={meal} />
  </>
}
