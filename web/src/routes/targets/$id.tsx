import { createFileRoute } from '@tanstack/react-router'
import {pb} from "#/pb.ts";
import {zTarget} from "#/entities/target.ts";
import TargetForm from "#/routes/targets/-components/target-form.tsx";

export const Route = createFileRoute('/targets/$id')({
  component: RouteComponent,
  loader: async ({ params: { id }}) => ({
    target: await pb.collection('targets').getOne(id).then(x => zTarget.parse(x))
  })
})

function RouteComponent() {
  const { target } = Route.useLoaderData();

  return <TargetForm target={target} />
}
