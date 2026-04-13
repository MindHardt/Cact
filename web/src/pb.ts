import PocketBase from 'pocketbase';
import type {PbRecord} from "#/entities/pb-record.ts";
import {z} from "zod";

export const pocketbaseUrl = z.string({ error: 'Pocketbase not configured' }).parse(import.meta.env.VITE_POCKETBASE_URL);

export const pb = new PocketBase(pocketbaseUrl);

export function uploadUrl(file: string, record: PbRecord) {
    return `${pocketbaseUrl}/api/files/${record.collectionName}/${record.id}/${file}`;
}