import {Button, Surface} from "@heroui/react";
import {ExternalLink} from "lucide-react";


export default function Footer() {

    return <footer>
        <Surface variant='tertiary' className='border-t p-2 flex flex-row justify-between items-center'>
            <a href='https://github.com/MindHardt/Cact' target='_blank'>
                <img height='32' width='32' src='/github.svg' alt='GitHub' />
            </a>
            <a href='https://un1ver5e.tech/' target='_blank'>
                <Button variant='secondary'>
                    Разработчик
                    <ExternalLink />
                </Button>
            </a>
        </Surface>
    </footer>
}