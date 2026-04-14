import {z} from "zod";
import {useForm} from "@tanstack/react-form";
import {pb} from "#/pb.ts";
import {Button, Input, Modal, Spinner, Surface} from "@heroui/react";
import {CakeSlice, Drumstick, Hamburger, Lock, Plus, Zap} from "lucide-react";
import {useState} from "react";
import InputNutritionalFact from "./input-nutritional-fact";
import InputFoodImage from "#/routes/foods/-form/input-food-image.tsx";
import {RootRoute} from "#/routes/__root.tsx";

const zValidator = z.object({
    name: z.string().nonempty(),
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    fats: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    unit: z.string().nonempty(),
    comment: z.string().optional(),
    image: z.file().optional()
});
const defaultValues : z.infer<typeof zValidator> = {
    name: "",
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0,
    unit: ""
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
            await pb.collection('foods').create({
                ...value,
                author: user!.id
            });
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
                            <Surface className='flex flex-col gap-1'>
                                <form.Field name='calories'>
                                    {field => (
                                        <InputNutritionalFact icon={<Zap />} letter='К' field={field} />
                                    )}
                                </form.Field>
                                <form.Field name='protein'>
                                    {field => (
                                        <InputNutritionalFact icon={<Drumstick />} letter='Б' field={field} />
                                    )}
                                </form.Field>
                                <form.Field name='fats'>
                                    {field => (
                                        <InputNutritionalFact icon={<Hamburger />} letter='Ж' field={field} />
                                    )}
                                </form.Field>
                                <form.Field name='carbs'>
                                    {field => (
                                        <InputNutritionalFact icon={<CakeSlice />} letter='У' field={field} />
                                    )}
                                </form.Field>
                            </Surface>
                            <form.Field name='unit'>
                                {field => (
                                    <Input
                                        placeholder='Единица измерения'
                                        value={field.state.value}
                                        onChange={e => field.handleChange(e.target.value)}
                                    />
                                )}
                            </form.Field>
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
