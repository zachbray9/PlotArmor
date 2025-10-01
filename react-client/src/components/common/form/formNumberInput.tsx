import { Field, InputGroup, NumberInput, Spinner } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

interface Props {
    name: string
    label?: string
    min?: number
    max?: number
    isSubmitting?: boolean
    required?: boolean
}

export default function FormNumberInput({ name, label, min, max, isSubmitting, required }: Props) {
    const {control, formState: {errors, touchedFields} } = useFormContext()
    const {field: {onChange, onBlur, value, ref}} = useController({name, control})

    const fieldError = errors[name]
    const errorMessage = fieldError?.message as string | undefined
    const isTouched = touchedFields[name]

    return (
        <Field.Root invalid={isTouched && !!fieldError} required={required}>
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <InputGroup endAddon={isSubmitting && <Spinner />}>
                <NumberInput.Root
                    id={name}
                    defaultValue="0"
                    min={min}
                    max={max}
                    disabled={isSubmitting}
                    value={value}
                    onValueChange={(details) => onChange(details.valueAsNumber)}
                    onBlur={onBlur}
                    ref={ref}
                >
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
            </InputGroup>

            {isTouched && fieldError && (
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            )}
        </Field.Root>
    )
}