import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import '../theme.css'
import {Surface} from "@heroui/react";
import {pb} from "#/pb.ts";
import {zUser} from "#/entities/user.ts";
import AuthHeader from "#/routes/-auth-header.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useRef} from "react";

export const Route = createRootRoute({
    component: RootComponent,
    beforeLoad: async () => {
        if (pb.authStore.token && !pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
        }
        return { user: zUser.nullish().parse(pb.authStore.record) }
    }
});

export const RootRoute = Route;

function RootComponent() {

    const qc = useRef(new QueryClient());

    return (
        <QueryClientProvider client={qc.current}>
            <Surface variant='secondary'>
                <AuthHeader />
                <main className='h-dvh w-full max-w-4xl mx-auto p-5'>
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
        </QueryClientProvider>
    )
}
