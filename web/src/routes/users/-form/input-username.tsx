import {useNavigate} from "@tanstack/react-router";
import {useState} from "react";
import {Button, InputGroup} from "@heroui/react";
import {Check, IdCard} from "lucide-react";
import {auth, type User} from "#/api.ts";


export default function InputUsername({ user } : {
    user: User
}) {
    const navigate = useNavigate();
    const [name, setName] = useState(user.name);
    const confirmUsername = async () => {
        if (!name || name.length == 0) {
            return;
        }

        await auth.updateUser({ name });
        await auth.getSession({ query: { disableCookieCache: true } });
        await navigate({ to: '.' });
    };

    return (
        <form onSubmit={async e => {
            e.preventDefault();
            e.stopPropagation();
            await confirmUsername();
        }}>
            <InputGroup className='w-full'>
                <InputGroup.Prefix>
                    <IdCard />
                </InputGroup.Prefix>
                <InputGroup.Input
                    placeholder='Имя пользователя'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {name.length > 0 && name !== user.name && (
                    <InputGroup.Suffix>
                        <Button size='sm' type='submit'>
                            <Check />
                        </Button>
                    </InputGroup.Suffix>
                )}
            </InputGroup>
        </form>
    )
}