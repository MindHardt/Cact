import { createFileRoute } from '@tanstack/react-router'
import MealForm from "#/routes/meals/-form/meal-form.tsx";
import BackButton from "#/components/back-button.tsx";

export const Route = createFileRoute('/meals/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <BackButton />
    <MealForm />
  </>
}
