import {createFileRoute, Link, redirect} from '@tanstack/react-router'
import {Button, Card, Chip, Tooltip} from "@heroui/react";
import {CircleCheck, Plus} from "lucide-react";
import BackButton from "#/components/back-button.tsx";
import { api } from '#/api';
import { getAll, zPaginatedResponse } from 'cact-shared/pagination.js';
import { isActive, zTarget } from 'cact-shared/zTarget.js';
import { calculateCalories } from 'cact-shared/extras.js';

export const Route = createFileRoute('/targets/')({
    beforeLoad: ({ context: { user }}) => {
        if (!user) {
            throw redirect({ to: '/' })
        }
    },
    loader: async () => ({
        targets: await api.targets.$get({ query: { ...getAll() } })
            .then(x => x.json())
            .then(x => zPaginatedResponse(zTarget).parse(x))
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const { targets } = Route.useLoaderData();

    return <div className='flex flex-col gap-2'>
        <BackButton navigate={{ to: '/meals' }}  />
        {targets.data.map(t => (
            <Link key={t.id} to='/targets/$id' params={{ id: t.id }}>
                <Card>
                    <Card.Header>
                        <Card.Title className='flex flex-row items-center gap-2'>
                            {t.name && <Chip>{t.name}</Chip> }
                            {t.activeFrom.toLocaleDateString()}
                            {isActive(t) && <ActiveIcon />}
                        </Card.Title>
                    </Card.Header>
                    <Card.Content className='flex flex-row items-center gap-2'>
                        {t.calories && t.calories > 0 ? (
                            <Chip size='md' className='text-lg font-semibold'>
                                {t.calories} Ккал
                            </Chip>
                        ) : <></>}
                        {calculateCalories(t) > 0 && (
                            <Chip variant='secondary' className='flex flex-row gap-1'>
                                <span>БЖУ:</span>
                                <span>{t.protein || '-'}</span>
                                <span>{t.fats || '-'}</span>
                                <span>{t.carbs || '-'}</span>
                            </Chip>
                        )}
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

function ActiveIcon() {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <CircleCheck size={16} />    
            </Tooltip.Trigger>
            <Tooltip.Content>
                <Tooltip.Arrow />
                Активная цель
            </Tooltip.Content>         
        </Tooltip>
    )
}
