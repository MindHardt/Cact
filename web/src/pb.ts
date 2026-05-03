import PocketBase, {ClientResponseError} from 'pocketbase';
import {z} from "zod";
import {notFound} from "@tanstack/react-router";

const pocketbaseUrl = z.string({ error: 'Pocketbase not configured' })
    .parse(import.meta.env.VITE_POCKETBASE_URL);

export const pb = new PocketBase(pocketbaseUrl, null, 'ru');

export function catchNotFound(error: any): never {
    if (error instanceof ClientResponseError && error.status === 404) {
        throw notFound();
    } else {
        throw error;
    }
}