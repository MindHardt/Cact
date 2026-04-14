import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import '../theme.css'
import {Surface} from "@heroui/react";

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Surface variant='secondary'>
        <main className='h-dvh w-full p-5 '>
            <Outlet />
        </main>
        <TanStackDevtools
            config={{
                position: 'bottom-right',
            }}
            plugins={[
                {
                    name: 'TanStack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                },
            ]}
        />
    </Surface>
  )
}
