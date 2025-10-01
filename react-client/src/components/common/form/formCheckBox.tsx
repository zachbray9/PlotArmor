import { Checkbox, Field } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

interface Props {
    name: string
    label: string
}

export default function FormCheckBox({name, label} : Props) {
    const {register, formState: {errors, touchedFields}} = useFormContext()

    const fieldError = errors[name]
    const errorMessage = fieldError?.message as string | undefined
    const isTouched = touchedFields[name]

    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>

            <Checkbox.Root {...register(name)}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
            </Checkbox.Root>

            {fieldError && isTouched && (
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            )}
        </Field.Root>
    )
}