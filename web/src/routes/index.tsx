import {createFileRoute, Link} from '@tanstack/react-router'
import {Button} from "@heroui/react";
import {Apple, Info, Lock, NotebookPen} from "lucide-react";
import {RootRoute} from "#/routes/__root.tsx";

export const Route = createFileRoute('/')({ component: App })

function App() {
    const { user } = RootRoute.useRouteContext();

  return (
    <article className='text-center flex flex-col gap-4'>
        <h1 className='text-3xl font-bold'>Cact - ваш помощник диеты</h1>
        <p>
            Приложение Cact помогает вам вести ежедневные записи вашей диеты
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            <Link to='/foods'>
                <Button size='lg' className='w-full'>
                    <Apple />
                    Каталог продуктов
                </Button>
            </Link>
            <Link to='/meals' disabled={!user}>
                <Button size='lg' className='w-full' isDisabled={!user}>
                    {user ? <NotebookPen /> : <Lock />}
                    Мой дневник
                </Button>
            </Link>
            <Button size='lg' className='w-full' isDisabled>
                <Info />
                О проекте
            </Button>
        </div>
    </article>
  )
}
