import {createFileRoute, Link, redirect} from '@tanstack/react-router'
import {pb} from "#/pb.ts";
import {zTarget} from "#/entities/target.ts";
import {Button, Card} from "@heroui/react";
import {Plus} from "lucide-react";
import BackButton from "#/components/back-button.tsx";

export const Route = createFileRoute('/targets/')({
    beforeLoad: ({ context: { user }}) => {
        if (!user) {
            throw redirect({ to: '/' })
        }
    },
    loader: async () => ({
        targets: await pb.collection('targets').getFullList()
            .then(r => r.map(x => zTarget.parse(x)))
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const { targets } = Route.useLoaderData();

    return <div className='flex flex-col gap-2'>
        <BackButton navigate={{ to: '/meals' }}  />
        {targets.map(t => (
            <Link key={t.id} to='/targets/$id' params={{ id: t.id }}>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            {t.activeFrom.toLocaleDateString()}
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        {t.calories} ккал
                    </Card.Content>
                </Card>
            </Link>
        ))}
        <Link to='/targets/new' className='px-5'>
            <Button className='w-full' size='sm'>
                <Plus />
            </Button>
        </Link>
    </div>
}
