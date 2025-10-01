import { Button, Field, Input, InputGroup, InputProps } from "@chakra-ui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface Props extends InputProps {
    name: string
    label: string
    hideable?: boolean
    required?: boolean
}

export default function FormInput({ name, label, hideable, required, ...props }: Props) {
    const [show, setShow] = useState(false)
    const {register, formState: {errors, touchedFields}} = useFormContext()

    const toggleVisibility = () => {
        setShow(!show)
    }

    const fieldError = errors[name]
    const isTouched: boolean = touchedFields[name]
    const errorMessage = fieldError?.message as string | undefined

    return (
        <Field.Root invalid={isTouched && !!fieldError} required={required}>
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>
            <InputGroup
                endElement={hideable &&
                    <Button onClick={toggleVisibility} variant='ghost' color='text.subtle' _hover={{ bg: 'none', color: 'text._dark' }}>{show ? 'hide' : 'show'}</Button>
                }
            >
                <Input
                    {...register(name)}
                    type={props.type ?? (hideable ? (show ? 'text' : 'password') : 'text')}
                />
            </InputGroup>

            {isTouched && fieldError && (
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            )}
        </Field.Root>
    )
}