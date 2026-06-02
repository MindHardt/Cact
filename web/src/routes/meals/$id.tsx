import {createFileRoute, redirect} from "@tanstack/react-router";
import MealForm from "#/routes/meals/-form/meal-form";
import BackButton from "#/components/back-button.tsx";
import { api, interceptNotFound } from '#/api';
import { zMeal } from "cact-shared/zMeal.js";

export const Route = createFileRoute('/meals/$id')({
  beforeLoad: ({ context: { user }}) => {
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
  loader: async ({ params: { id }}) => ({
    meal: await api.meals[':id'].$get({ param: { id }})
      .then(interceptNotFound)
      .then(x => x.json())
      .then(x => zMeal.parse(x))
  })
})

function RouteComponent() {
  const { meal } = Route.useLoaderData();

  return <>
    <BackButton />
    <MealForm meal={meal} />
  </>
}
