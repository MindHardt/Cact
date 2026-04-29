import {RootRoute} from "#/routes/__root.tsx";
import {Avatar, Button, Dropdown, Header, Label, Separator} from "@heroui/react";
import {avatarFallback, avatarSrc, type User} from "#/entities/user.ts";
import {pb} from "#/pb.ts";
import {Link, useNavigate} from "@tanstack/react-router";
import {Lock} from "lucide-react";


export default function AuthHeader() {

    const { user } = RootRoute.useRouteContext();

    const Controls = user
        ? <UserControls user={user} />
        : <LoginControls />;

    return <header className='bg-accent p-2 flex flex-row gap-5 justify-center items-center'>
        <Link to='/' className='size-10 transition-[scale] hover:scale-110'>
            <img className='size-full' src='/logo64.png' alt='Logo' />
        </Link>
        <span className='text-background tracking-wide text-2xl font-bold'>Cact</span>
        {Controls}
    </header>

}

function UserControls({ user } : { user: User }) {

    const navigate = useNavigate();
    const logout = async () => {
        pb.authStore.clear();
        await navigate({ to: '.' });
    }

    return <Dropdown>
        <Dropdown.Trigger className='flex flex-row gap-1 items-center justify-center'>
            <Avatar>
                <Avatar.Image alt={user.name} src={avatarSrc(user, { thumb: '40x40f' })} />
                <Avatar.Fallback>{avatarFallback(user)}</Avatar.Fallback>
            </Avatar>
        </Dropdown.Trigger>
        <Dropdown.Popover>
            <Dropdown.Menu className='p-4' onAction={(key) => key === 'logout' && logout()}>
                <Dropdown.Section>
                    <Header>{user.name}</Header>
                </Dropdown.Section>
                <Separator />
                <Dropdown.Section>
                    <Dropdown.Item>
                        <Link to='/users/me'>
                            <Label>Профиль</Label>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item id='logout' textValue="Выйти" variant="danger">
                        <Label>Выйти</Label>
                    </Dropdown.Item>
                </Dropdown.Section>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown>
}

function LoginControls() {

    const navigate = useNavigate();
    const { providers } = RootRoute.useLoaderData();
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