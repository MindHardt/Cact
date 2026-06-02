import { createFileRoute, redirect } from '@tanstack/react-router'
import TargetForm from "#/routes/targets/-components/target-form.tsx";

export const Route = createFileRoute('/targets/new')({
  component: RouteComponent,
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return <TargetForm />
}
