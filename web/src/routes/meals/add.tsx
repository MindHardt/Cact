import {createFileRoute, redirect} from '@tanstack/react-router'
import MealForm from "#/routes/meals/-form/meal-form.tsx";
import BackButton from "#/components/back-button.tsx";

export const Route = createFileRoute('/meals/add')({
  beforeLoad: ({ context: { user }}) => {
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <BackButton />
    <MealForm />
  </>
}
