import {RootRoute} from "#/routes/__root.tsx";
import {Avatar, Button, Dropdown, Header, Label, Separator} from "@heroui/react";
import {Link, useNavigate} from "@tanstack/react-router";
import {DoorClosed, Lock, NotebookPen, Target, UserPen} from "lucide-react";
import Logo from "#/components/logo.tsx";
import {auth, type User} from "#/api.ts";
import { avatarFallback, avatarSrc } from "#/routes/users/-avatar-fns";


export default function AuthHeader() {

    const { user } = RootRoute.useRouteContext();

    const Controls = user
        ? <UserControls user={user} />
        : <LoginControls />;

    return <header className='bg-accent text-background p-2 flex flex-row gap-5 justify-center items-center'>
        <Logo />
        <span className='tracking-wide text-2xl font-bold'>Cact</span>
        {Controls}
    </header>

}

function UserControls({ user } : { user: User }) {

    const navigate = useNavigate();
    const logout = async () => {
        await auth.signOut();
        await navigate({ to: '.' });
    }

    return <Dropdown>
        <Dropdown.Trigger className='flex flex-row gap-1 items-center justify-center'>
            <Avatar>
                <Avatar.Image alt={user.name} src={avatarSrc(user)} />
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
                            <Label className='flex flex-row gap-1 items-center'>
                                <UserPen />
                                Профиль
                            </Label>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Link to='/targets'>
                            <Label className='flex flex-row gap-1 items-center'>
                                <Target />
                                Цели
                            </Label>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Link to='/meals'>
                            <Label className='flex flex-row gap-1 items-center'>
                                <NotebookPen />
                                Дневник
                            </Label>
                        </Link>
                    </Dropdown.Item>
                    <Separator className='my-2' />
                    <Dropdown.Item id='logout' textValue="Выйти" variant="danger">
                        <Label className='flex flex-row gap-1 items-center justify-between w-full'>
                            <span className='me-auto'>Выйти</span>
                            <DoorClosed />
                        </Label>
                    </Dropdown.Item>
                </Dropdown.Section>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown>
}

function LoginControls() {

    const navigate = useNavigate();
    const providers = [{
        name: 'github', displayName: 'GitHub'
    }];
    const login = async (key: number | string) => auth
        .signIn.social({
            provider: typeof key === 'number' ? providers[key].name : key,
            callbackURL: window.location.href,
            errorCallbackURL: window.location.href,
            newUserCallbackURL: window.location.href
        })
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