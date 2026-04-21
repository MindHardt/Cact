import PocketBase from 'pocketbase';
import {z} from "zod";

export const pocketbaseUrl = z.string({ error: 'Pocketbase not configured' })
    .parse(import.meta.env.VITE_POCKETBASE_URL);

export const pb = new PocketBase(pocketbaseUrl);