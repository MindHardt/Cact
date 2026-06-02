import {Avatar, Button, ButtonGroup} from "@heroui/react";
import {Trash, Upload} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";
import {useRef} from "react";
import {api, auth, uploadUrl, type User} from "#/api.ts";
import {avatarFallback, avatarSrc} from "../-avatar-fns";
import { zUpload } from "cact-shared/zUpload.js";

export default function InputAvatar({ user }: {
    user: User
}) {

    const input = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const setAvatar = async (avatar: File | null) => {
        const image = avatar
            ? await api.uploads.$post({ form: { scope: 'USER_AVATAR', file: avatar }})
                .then(x => x.json())
                .then(x => uploadUrl(zUpload.parse(x).id))
            : null;
        await auth.updateUser({ image });
        await auth.getSession({ query: { disableCookieCache: true } });
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
                {user.image && (
                    <Button variant='danger' onClick={() => setAvatar(null)}>
                        <Trash />
                    </Button>
                )}
            </ButtonGroup>
        </div>
    )
}