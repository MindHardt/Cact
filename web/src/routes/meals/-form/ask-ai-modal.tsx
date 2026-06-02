import {z} from "zod";
import {useState} from "react";
import {Button, Modal, Spinner, TextArea} from "@heroui/react";
import {WandSparkles} from "lucide-react";
import {useForm} from "@tanstack/react-form";
import { api } from "#/api";
import { zAiPrompt } from "cact-shared/zAiPrompt.js";

const zValidator = z.object({
    prompt: z.string().nonempty()
})

export default function AskAiModal({ onResponseReceived } : {
    onResponseReceived?: (response: z.infer<typeof zAiPrompt>) => void
}) {

    const [open, setOpen] = useState(false);
    const form = useForm({
        defaultValues: {
            prompt: ''
        },
        validators: {
            onMount: zValidator,
            onChange: zValidator
        },
        onSubmit: async ({ value: { prompt }}) => {
            const res = await api["ai-prompts"].$post({ json: { text: prompt } })
                .then(x => x.json())
                .then(x => zAiPrompt.parse(x));
                
            onResponseReceived && onResponseReceived(res);
            setOpen(false);
        }
    })

    return (
        <Modal isOpen={open} onOpenChange={setOpen}>
            <Button variant='secondary'>
                <WandSparkles />
                <span className='hidden md:inline'>Спросить ИИ</span>
            </Button>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-90">
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>Спросить ИИ</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <form
                                className='p-2'
                                onSubmit={async e => {
                                e.preventDefault();
                                e.stopPropagation();
                                await form.handleSubmit(e);
                            }}>
                                <form.Field name='prompt'>
                                    {field => (
                                        <TextArea
                                            className='w-full min-h-60'
                                            placeholder='Пельмени с говядиной 200 грамм, компот из сухофруктов 250мл'
                                            value={field.state.value}
                                            onChange={e => field.handleChange(e.target.value)}
                                        />
                                    )}
                                </form.Field>
                                <form.Subscribe selector={({ isValid, isSubmitting }) => ([isValid, isSubmitting])}>
                                    {([isValid, isSubmitting]) =>
                                        <Button className='w-full' size='lg' type='submit' isDisabled={!isValid || isSubmitting}>
                                            {isSubmitting && <Spinner />}
                                            Отправить
                                        </Button>}
                                </form.Subscribe>
                            </form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )

}