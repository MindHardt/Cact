import {createFileRoute, Navigate} from '@tanstack/react-router'
import {RootRoute} from "#/routes/__root.tsx";
import UserEditForm from "#/routes/users/-form/user-edit-form.tsx";

export const Route = createFileRoute('/users/me')({
  component: RouteComponent,
})

function RouteComponent() {

    const { user } = RootRoute.useRouteContext();
    if (!user) {
        return <Navigate to='/' />
    }

    return <UserEditForm user={user} />
}
