import NothingFound from "#/components/nothing-found.tsx";
import {Link} from "@tanstack/react-router";
import {ArrowLeft} from "lucide-react";
import {Button} from "@heroui/react";

export default function NotFoundComponent() {

    return (
        <div className='flex flex-col gap-2'>
            <NothingFound />
            <Link to='/' className='mx-auto'>
                <Button>
                    <ArrowLeft />
                    На главную
                </Button>
            </Link>
        </div>
    )

}