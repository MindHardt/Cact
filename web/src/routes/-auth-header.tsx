import {RootRoute} from "#/routes/__root.tsx";
import {Avatar, Button, Dropdown, Label, Spinner} from "@heroui/react";
import type {User} from "#/entities/user.ts";
import {pb, uploadUrl} from "#/pb.ts";
import {useNavigate} from "@tanstack/react-router";
import {useQuery} from "@tanstack/react-query";
import {Lock} from "lucide-react";


export default function AuthHeader() {

    const { user } = RootRoute.useRouteContext();

    const Controls = user
        ? <UserControls user={user} />
        : <LoginControls />;

    return <header className='bg-accent p-2 flex flex-row justify-center'>
        {Controls}
    </header>

}

function UserControls({ user } : { user: User }) {

    const navigate = useNavigate();
    const logout = async () => {
        pb.authStore.clear();
        await navigate({ to: '.' });
    }
    const fallback = user.name
        .split(' ', 2)
        .map(x => x[0].toUpperCase())
        .join('');

    return <Dropdown>
        <Dropdown.Trigger className='flex flex-row gap-1 items-center justify-center'>
            <Avatar>
                {user.avatar && <Avatar.Image alt={user.name} src={uploadUrl(user.avatar, user)} />}
                <Avatar.Fallback>{fallback}</Avatar.Fallback>
            </Avatar>
        </Dropdown.Trigger>
        <Dropdown.Popover>
            <Dropdown.Menu  onAction={() => logout()}>
                <Dropdown.Item textValue="Выйти" variant="danger">
                    <Label>Выйти</Label>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown>
}

function LoginControls() {

    const navigate = useNavigate();
    const { data: providers } = useQuery({
        queryKey: ['auth-methods'],
        queryFn: async () => pb
            .collection('users')
            .listAuthMethods()
            .then(x => x.oauth2.providers),
        staleTime: Infinity
    });
    if (!providers) {
        return <Button isDisabled>
            <Spinner />
            Войти
        </Button>
    }

    const login = async (key: number | string) => pb
        .collection('users')
        .authWithOAuth2({ provider: typeof key === 'number' ? providers[key].name : key })
        .then(() => navigate({ to: '.' }))

    if (providers.length == 1) {
        return <Button variant='secondary' onClick={() => login(providers[0].name)}>
            <Lock />
            Войти
        </Button>
    }

    return <Dropdown>
        <Button variant='secondary'>
            <Lock />
            Войти
        </Button>
        <Dropdown.Popover>
            <Dropdown.Menu onAction={login}>
                {providers.map(s => (
                    <Dropdown.Item key={s.name} id={s.name} textValue={s.displayName}>
                        <Label>{s.displayName}</Label>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown>

}