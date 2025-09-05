import { Field, InputGroup, NumberInput, Spinner } from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

interface Props {
    name: string
    label?: string
    min?: number
    max?: number
    autoSubmit?: boolean
    isSubmtting?: boolean
    required?: boolean
}

export default function FormNumberInput({ name, label, min, max, autoSubmit, isSubmtting, required }: Props) {
    const [field, meta] = useField(name)
    const { setFieldValue, submitForm } = useFormikContext()

    const debouncedSubmitRef = useRef(debounce(() => submitForm(), 800));

    useEffect(() => {
        const debouncedSubmit = debouncedSubmitRef.current

        return () => {
            debouncedSubmit.cancel()
        }
    }, [])

    const handleChange = (valueAsNumber: number) => {
        if (valueAsNumber !== field.value) {
            setFieldValue(name, valueAsNumber)

            if (autoSubmit) {
                debouncedSubmitRef.current()
            }
        }
    }

    return (
        <Field.Root invalid={meta.touched && !!meta.error} required={required}>
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <InputGroup endAddon={isSubmtting && <Spinner />}>
                <NumberInput.Root
                    {...field}
                    id={name}
                    defaultValue="0"
                    min={min}
                    max={max}
                    onValueChange={value => handleChange(value.valueAsNumber)}
                    disabled={isSubmtting}
                >
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
            </InputGroup>

            {meta.touched && meta.error && (
                <Field.ErrorText>{meta.error}</Field.ErrorText>
            )}
        </Field.Root>
    )
}