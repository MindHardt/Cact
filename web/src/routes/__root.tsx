import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css';
import '../theme.css';
import "@fontsource/open-sans/500.css";
import {Surface} from "@heroui/react";
import {pb} from "#/pb.ts";
import {zUser} from "#/entities/user.ts";
import AuthHeader from "#/routes/-auth-header.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useRef} from "react";
import Footer from "#/routes/-footer.tsx";

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
            <Surface variant='secondary' className='h-dvh flex flex-col'>
                <AuthHeader />
                <main className='w-full max-w-4xl mx-auto p-5 grow'>
                    <Outlet />
                </main>
                <Footer />
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
