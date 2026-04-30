
import {Button} from "@heroui/react";
import type {ComponentProps} from "react";
import {type NavigateOptions, useRouter} from "@tanstack/react-router";
import {ArrowLeft} from "lucide-react";


export default function BackButton({ navigate, ...props } : {
    navigate?: NavigateOptions
} & Omit<ComponentProps<typeof Button>, 'onClick' | 'children'>) {

    const router = useRouter();
    const onClick = () => navigate
        ? router.navigate(navigate)
        : router.history.back();

    return <Button variant='secondary' {...props} onClick={onClick}>
        <ArrowLeft />
        Назад
    </Button>
}