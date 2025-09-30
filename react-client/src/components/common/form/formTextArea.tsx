import { Field, Textarea, TextareaProps } from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import { ChangeEvent } from "react";

interface Props extends TextareaProps {
    name: string
    label: string
    required?: boolean
}

export default function FormTextArea({ name, label, required, ...props }: Props) {
    const [field, meta] = useField(name)
    const { setFieldValue } = useFormikContext()

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value
        setFieldValue(name, input)
    }

    return (
        <Field.Root invalid={meta.touched && !!meta.error} required={required}>
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <Textarea
                {...props}
                value={field.value}
                onChange={handleInputChange}
            />


            {meta.touched && meta.error && (
                <Field.ErrorText>{meta.error}</Field.ErrorText>
            )}
        </Field.Root>
    )
}