import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import {Button, Input, Modal, Spinner, Surface, TextArea} from "@heroui/react";
import {Lock, Plus} from "lucide-react";
import {useState} from "react";
import InputFoodImage from "./input-food-image.tsx";
import InputNutritionalFact from "#/components/input-nutritional-fact.tsx";
import { api, uploadUrl } from "#/api.ts";
import { zFood } from "cact-shared/zFood.js";
import { RootRoute } from "#/routes/__root.tsx";
import { zUpload } from "cact-shared/zUpload.js";

const zValidator = zFood.pick({
    name: true,
    description: true,
    facts: true,
    units: true
}).extend({
    image: z.file().nullable()
})
const defaultValues : z.infer<typeof zValidator> = {
    name: "",
    description: null,
    facts: {
        protein: 0,
        fats: 0,
        carbs: 0
    },
    units: [{
        name: '100 грамм',
        multiplier: 1
    }],
    image: null
}

export default function NewFoodForm({ onCreated } : {
    onCreated?: () => void | Promise<void>
}) {

    const { user } = RootRoute.useRouteContext();
    const [open, setOpen] = useState(false);
    const form = useForm({
        validators: {
            onChange: zValidator,
            onSubmit: zValidator,
            onMount: zValidator
        },
        defaultValues,
        onSubmit: async ({ value }) => {
            const imageId = value.image
                ? await api.uploads.$post({ form: { scope: 'FOOD_IMAGE', file: value.image }})
                    .then(x => x.json())
                    .then(x => zUpload.parse(x))
                    .then(x => uploadUrl(x))
                : null

            await api.foods.$post({ json: {
                ...value,
                imageId
            }})
            setOpen(false);
            form.reset();
            onCreated && await onCreated();
        }
    });

    return <Modal isOpen={open} onOpenChange={setOpen}>
        <Button size='sm' isDisabled={!user}>
            {user ? <Plus /> : <Lock />}
            <span className='hidden md:inline'>Добавить</span>
        </Button>
        <Modal.Backdrop>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-90">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>Новый продукт</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <form
                            className='flex flex-col gap-2 p-2'
                            onSubmit={async e => {
                                e.preventDefault();
                                e.stopPropagation();
                                await form.handleSubmit();
                            }}
                        >
                            <form.Field name='name'>
                                {field => (
                                    <Input
                                        placeholder='Название'
                                        value={field.state.value}
                                        onChange={e => field.handleChange(e.target.value)}
                                    />
                                )}
                            </form.Field>
                            <form.Field name='description'>
                                {field => (
                                    <TextArea 
                                        placeholder='Примечания'
                                        value={field.state.value ?? ''}
                                        onChange={e => field.handleChange(e.target.value.length > 0 ? e.target.value : null)}
                                    />
                                )}
                            </form.Field>
                            <Surface className='flex flex-col gap-1'>
                                <form.Field name='facts.protein'>
                                    {field => (
                                        <InputNutritionalFact withLetter field={{
                                            name: 'protein',
                                            state: field.state,
                                            handleChange: x => field.handleChange(x ?? 0)
                                        }} />
                                    )}
                                </form.Field>
                                <form.Field name='facts.fats'>
                                    {field => (
                                        <InputNutritionalFact withLetter field={{
                                            name: 'fats',
                                            state: field.state,
                                            handleChange: x => field.handleChange(x ?? 0)
                                        }} />
                                    )}
                                </form.Field>
                                <form.Field name='facts.carbs'>
                                    {field => (
                                        <InputNutritionalFact withLetter field={{
                                            name: 'carbs',
                                            state: field.state,
                                            handleChange: x => field.handleChange(x ?? 0)
                                        }} />
                                    )}
                                </form.Field>
                            </Surface>
                            <form.Field name='image'>
                                {field => (
                                    <InputFoodImage field={field} />
                                )}
                            </form.Field>
                            <form.Subscribe selector={({ isValid, isSubmitting }) => ([isValid, isSubmitting])}>
                                {([isValid, isSubmitting]) =>
                                    <Button className='w-full' size='lg' type='submit' isDisabled={!isValid || isSubmitting}>
                                        {isSubmitting && <Spinner />}
                                        Создать
                                    </Button>}
                            </form.Subscribe>
                        </form>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
}
