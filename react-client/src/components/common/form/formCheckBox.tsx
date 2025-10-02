import { Checkbox, Field } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

interface Props {
    name: string
    label: string
}

export default function FormCheckBox({ name, label }: Props) {
    const { control, formState: { errors, touchedFields } } = useFormContext()
    const { field: { onChange, value, ref } } = useController({ name, control })

    const fieldError = errors[name]
    const errorMessage = fieldError?.message as string | undefined
    const isTouched = touchedFields[name]

    return (
        <Field.Root invalid={isTouched && !!fieldError}>
            <Field.Label>{label}</Field.Label>

            <Checkbox.Root
                checked={value}
                onCheckedChange={({ checked }) => onChange(checked)}
                ref={ref}
            >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
            </Checkbox.Root>

            {fieldError && isTouched && (
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            )}
        </Field.Root>
    )
}