import {avatarFallback, avatarSrc, type User} from "#/entities/user.ts";
import {Avatar, Button, ButtonGroup} from "@heroui/react";
import {pb} from "#/pb.ts";
import {Trash, Upload} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";
import {useRef} from "react";

export default function InputAvatar({ user }: {
    user: User
}) {

    const input = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const setAvatar = async (avatar: File | null) => {
        await pb.collection('users').update(user.id, {
            avatar
        });
        await navigate({ to: '.' });
    }

    return (
        <div className='flex flex-row gap-1'>
            <input
                ref={input}
                hidden
                type='file'
                accept='image/*'
                onChange={e => setAvatar(e.target.files![0])}
            />
            <Avatar>
                <Avatar.Image alt={user.name} src={avatarSrc(user)} />
                <Avatar.Fallback>{avatarFallback(user)}</Avatar.Fallback>
            </Avatar>
            <ButtonGroup className='w-full'>
                <Button className='grow' onClick={() => input.current!.click()}>
                    <Upload />
                    Загрузить аватар
                </Button>
                {user.avatar && (
                    <Button variant='danger' onClick={() => setAvatar(null)}>
                        <Trash />
                    </Button>
                )}
            </ButtonGroup>
        </div>
    )
}