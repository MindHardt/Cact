import type {Food} from "#/entities/food.ts";
import {Link} from "@tanstack/react-router";
import {Card} from "@heroui/react";
import {uploadUrl} from "#/pb.ts";


export default function FoodCard({ food } : {
    food: Food
}) {

    return <Link to='/foods/$id' params={{ id: food.id }}>
        <Card>
            {food.image && (
                <div className='w-full max-h-80 rounded-lg overflow-hidden'>
                    <img
                        className='size-full'
                        alt=''
                        src={uploadUrl(food.image, food)}
                        loading='lazy'
                    />
                </div>
            )}
            <Card.Header>
                <Card.Title className='text-center'>{food.name}</Card.Title>
            </Card.Header>
        </Card>
    </Link>
}