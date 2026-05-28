import type {Hono} from "hono";
import type {HonoType} from "../index";


export type EndpointFn<
    TBefore extends Hono<HonoType> = Hono<HonoType>,
    TAfter extends TBefore = TBefore
> = (before: TBefore) => TAfter;

export function endpoint(fn: EndpointFn) : EndpointFn {
    return (hono) => fn(hono);
}