import { createFileRoute, redirect } from "@tanstack/react-router";
import TargetForm from "#/routes/targets/-components/target-form.tsx";
import { api, interceptNotFound } from "#/api";
import { zTarget } from "cact-shared/zTarget.js";

export const Route = createFileRoute('/targets/$id')({
  component: RouteComponent,
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
  loader: async ({ params: { id } }) => ({
    target: await api.targets[':id'].$get({ param: { id } })
      .then(interceptNotFound)
      .then(x => x.json())
      .then(x => zTarget.parse(x))
  })
})

function RouteComponent() {
  const { target } = Route.useLoaderData();

  return <TargetForm target={target} />
}
