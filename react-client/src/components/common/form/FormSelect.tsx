import { useField, useFormikContext } from "formik";
import { createListCollection, Field, Portal, Select } from '@chakra-ui/react';
import { SelectOption } from '../../../models/selectOption';

interface Props<T> {
    name: string
    options: SelectOption<T>[]
    label?: string
    autoSubmit?: boolean
    isSubmitting?: boolean
    multiple?: boolean
    required?: boolean
}

// Define the event type based on Chakra UI's Select component
interface SelectValueChangeDetails {
    value: string[]
}


export default function FormSelect<T extends string | number>({ name, label, options, autoSubmit, isSubmitting, multiple, required }: Props<T>) {
    const [field, meta] = useField(name)
    const { setFieldValue, submitForm } = useFormikContext()

    const collection = createListCollection({
        items: options.map(option => option)
    })

    const handleValueChange = (details: SelectValueChangeDetails) => {
        setFieldValue(name, details.value)

        if (autoSubmit) {
            submitForm()
        }
    }


    return (
        <Field.Root invalid={meta.touched && !!meta.error} required={required}>
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <Select.Root
                collection={collection}
                value={field.value}
                disabled={isSubmitting}
                onValueChange={handleValueChange}
                multiple={multiple}
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select value" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {collection.items.map((option) => (
                                <Select.Item key={option.value} item={option}>
                                    {option.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>

            {meta.touched && meta.error && (
                <Field.ErrorText>{meta.error}</Field.ErrorText>
            )}
        </Field.Root>
    )
}