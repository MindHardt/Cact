import type {User} from "#/api.ts";

export function avatarFallback(user : User) {
    return user.name
        .split(' ', 2)
        .map(x => x[0]?.toUpperCase() ?? '')
        .join('');
}

export function avatarSrc(user : User) {
    return user.image ?? undefined;
}