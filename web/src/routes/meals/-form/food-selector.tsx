import {useDebouncedValue} from "@tanstack/react-pacer";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {Button, InputGroup, Modal, Spinner} from "@heroui/react";
import {Search, Utensils} from "lucide-react";
import {useState} from "react";
import FoodCard from "#/components/food-card.tsx";
import { api } from "#/api";
import { getAll, zPaginatedResponse } from "cact-shared/pagination.js";
import { zFood, type Food } from "cact-shared/zFood.js";


export default function FoodSelector({ onSelected } : {
    onSelected?: (food: Food) => void
}) {

    const [open, setOpen] = useState(false);
    const [search, searchDebouncer] = useDebouncedValue('', { wait: 500 });
    const { data: foods } = useQuery({
        placeholderData: keepPreviousData,
        queryKey: ['meals', search],
        queryFn: async () => await api.foods.$get({ query: { search, ...getAll() } })
            .then(x => x.json())
            .then(x => zPaginatedResponse(zFood).parse(x))
    });
    const onClick = (food: Food) => {
        setOpen(false);
        onSelected && onSelected(food);
    }

    return (
        <Modal isOpen={open} onOpenChange={setOpen}>
            <Button className='grow'>
                <Utensils />
                Добавить блюдо
            </Button>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Icon><Utensils /></Modal.Icon>
                            <Modal.Heading />
                        </Modal.Header>
                        <Modal.Body className='flex flex-col gap-4 p-2'>
                            <InputGroup>
                                <InputGroup.Input
                                    placeholder='Поиск...'
                                    onChange={e => searchDebouncer.maybeExecute(e.target.value)}
                                />
                                <InputGroup.Suffix>
                                    <Button size='sm' onClick={() => searchDebouncer.flush()}>
                                        <Search />
                                    </Button>
                                </InputGroup.Suffix>
                            </InputGroup>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-2 max-h-120 overflow-y-auto p-2'>
                                {foods ? foods.data.map(food => (
                                    <a onClick={() => onClick(food)}>
                                        <FoodCard food={food} />
                                    </a>
                                )) : <Spinner />}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}