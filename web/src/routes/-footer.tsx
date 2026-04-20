import {Button, Surface} from "@heroui/react";
import {Bug, ExternalLink} from "lucide-react";


export default function Footer() {

    return <footer>
        <Surface variant='tertiary' className='border-t p-2 flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-2 items-center'>
                <a href='https://github.com/MindHardt/Cact' target='_blank'>
                    <img height='32' width='32' src='/github.svg' alt='GitHub' />
                </a>
                <a href='https://github.com/MindHardt/Cact/issues/new' target='_blank'>
                    <Button variant='secondary'>
                        <Bug />
                        <span className='hidden sm:inline'>Нашли ошибку?</span>
                    </Button>
                </a>
            </div>
            <a href='https://un1ver5e.tech/' target='_blank'>
                <Button variant='secondary'>
                    Разработчик
                    <ExternalLink />
                </Button>
            </a>
        </Surface>
    </footer>
}