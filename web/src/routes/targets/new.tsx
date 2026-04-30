import { createFileRoute } from '@tanstack/react-router'
import TargetForm from "#/routes/targets/-components/target-form.tsx";

export const Route = createFileRoute('/targets/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TargetForm />
}
