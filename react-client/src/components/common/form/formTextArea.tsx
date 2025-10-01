import { Field, Textarea, TextareaProps } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

interface Props extends TextareaProps {
    name: string
    label: string
    required?: boolean
}

export default function FormTextArea({ name, label, required, ...props }: Props) {
    const {register, formState: {errors, touchedFields}} = useFormContext()

    const fieldError = errors[name]
    const errorMessage = fieldError?.message as string | undefined
    const isTouched = touchedFields[name]

    return (
        <Field.Root invalid={isTouched && !!fieldError} required={required}>
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <Textarea
                {...register(name)}
                {...props}
            />


            {isTouched && fieldError && (
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            )}
        </Field.Root>
    )
}