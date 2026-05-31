import { useRef, useState } from "react";
import { Button, ButtonGroup, Surface } from "@heroui/react";
import { ImagePlus, Trash } from "lucide-react";
import { uploadUrl } from "#/api";

export default function InputFoodImage({ readonly, field }: {
    readonly: boolean,
    field: { state: { value: File | string | null }, handleChange: (value: File | string | null) => void }
}) {

    const input = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(typeof field.state.value === 'string' ? uploadUrl(field.state.value) : null);
    const setFile = (file: File | null) => {
        preview && URL.revokeObjectURL(preview);
        setPreview(file ? URL.createObjectURL(file) : null);
        field.handleChange(file);
    }

    return <>
        <input
            accept='image/*'
            ref={input}
            hidden
            type='file'
            onChange={e => setFile(e.target.files![0])}
        />
        <Surface className='flex flex-col gap-1'>
            {preview && (
                <div className='rounded-2xl overflow-hidden max-w-full flex justify-center items-center mx-auto'>
                    <img className='max-w-full max-h-80' src={preview} alt='' loading='lazy' />
                </div>
            )}
            {readonly === false && (
                <ButtonGroup className='w-full'>
                    <Button className='w-full' onClick={() => input.current!.click()}>
                        <ImagePlus />
                    </Button>
                    <Button onClick={() => setFile(null)}>
                        <Trash />
                    </Button>
                </ButtonGroup>
            )}
        </Surface>
    </>
}