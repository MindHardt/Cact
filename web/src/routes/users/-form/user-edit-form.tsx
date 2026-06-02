import {Card} from "@heroui/react";
import InputUsername from "#/routes/users/-form/input-username.tsx";
import InputAvatar from "#/routes/users/-form/input-avatar.tsx";
import type {User} from "#/api.ts";

export default function UserEditForm({ user } : {
    user: User
}) {

    return <Card className='rounded-2xl max-w-md mx-auto'>
        <Card.Header>
            <Card.Title className='text-lg text-center font-semibold'>Профиль</Card.Title>
        </Card.Header>
        <Card.Content>
            <InputAvatar user={user} />
        </Card.Content>
        <Card.Content>
            <InputUsername user={user} />
        </Card.Content>
    </Card>
}