
import {Button} from "@heroui/react";
import type {ComponentProps} from "react";
import {useRouter} from "@tanstack/react-router";
import {ArrowLeft} from "lucide-react";


export default function BackButton(props: Omit<ComponentProps<typeof Button>, 'onClick' | 'children'>) {

    const router = useRouter();

    return <Button variant='secondary' {...props} onClick={() => router.history.back()}>
        <ArrowLeft />
        Назад
    </Button>
}