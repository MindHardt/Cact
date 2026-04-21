import type {Food} from "#/entities/food.ts";
import {Link} from "@tanstack/react-router";
import {Card} from "@heroui/react";
import {pb} from "#/pb.ts";


export default function FoodCard({ food } : {
    food: Food
}) {

    return <Link to='/foods/$id' params={{ id: food.id }}>
        <Card className='h-full'>
            <div className='w-full max-h-80 rounded-2xl overflow-hidden grow flex flex-col justify-end'>
                <img
                    className='max-w-full max-h-full'
                    alt=''
                    src={food.image ? pb.files.getURL(food, food.image) : '/food.svg'}
                    loading='lazy'
                />
            </div>
            <Card.Header>
                <Card.Title className='text-center'>{food.name}</Card.Title>
            </Card.Header>
        </Card>
    </Link>
}