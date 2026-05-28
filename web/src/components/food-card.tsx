import {Link} from "@tanstack/react-router";
import {Card} from "@heroui/react";
import {uploadUrl} from "#/api";
import type {Food} from "cact-shared/zFood";

export default function FoodCard({ food, withLink } : {
    withLink?: boolean,
    food: Food
}) {

    const Content = <Card className='h-full'>
        <div className='w-full max-h-80 rounded-2xl overflow-hidden grow flex flex-col justify-end'>
            <img
                className='max-w-full max-h-full'
                alt=''
                src={food.imageId ? uploadUrl(food.imageId) : '/food.svg'}
                loading='lazy'
            />
        </div>
        <Card.Header>
            <Card.Title className='text-center'>{food.name}</Card.Title>
        </Card.Header>
    </Card>;

    return withLink ? <Link to='/foods/$id' params={{ id: food.id }}>{Content}</Link> : Content;
}