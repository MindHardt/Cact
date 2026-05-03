import type {ErrorComponentProps} from "@tanstack/react-router";
import {Button, Card} from "@heroui/react";
import {Bug, ExternalLink, RotateCcw} from "lucide-react";


export default function ErrorComponent({ error, reset } : ErrorComponentProps) {

    return (
        <div className='w-full h-dvh flex p-2 bg-background'>
            <Card className='max-w-lg m-auto'>
                <Card.Header>
                    <Card.Title className='flex flex-row gap-1 items-center'>
                        <span className='text-lg'>Произошла ошибка</span>
                        <Bug color='var(--color-danger)' />
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    {'status' in error && !!error.status && (
                        <p>
                            Код ошибки: <b>{`${error.status}`}</b>
                        </p>
                    )}
                    <p className='font-mono'>
                        {error.message}
                    </p>
                </Card.Content>
                <Card.Footer className='flex-col gap-2'>
                    <Button onClick={reset} variant='danger'>
                        <RotateCcw />
                        Попробовать снова
                    </Button>
                    <a href='https://github.com/MindHardt/Cact/issues/new' target='_blank'>
                        <Button variant='secondary'>
                            <ExternalLink />
                            Сообщить об ошибке
                        </Button>
                    </a>
                </Card.Footer>
            </Card>
        </div>
    )

}