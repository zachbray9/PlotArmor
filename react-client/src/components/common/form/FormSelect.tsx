import { useField, useFormikContext } from "formik";
import { Field, ListCollection, Portal, Select, Spinner } from '@chakra-ui/react';
import { SelectOption } from "../../../models/selectOption";

interface Props {
    name: string
    collection: ListCollection<SelectOption>
    label?: string
    autoSubmit?: boolean
    isSubmitting?: boolean
    multiple?: boolean
    required?: boolean
    loading?: boolean
}

// Define the event type based on Chakra UI's Select component
interface SelectValueChangeDetails {
    value: string[]
}


export default function FormSelect({ name, label, collection, autoSubmit, isSubmitting, multiple, required, loading }: Props) {
    const [field, meta] = useField(name)
    const { setFieldValue, submitForm } = useFormikContext()

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
                        {loading && (
                            <Spinner size="xs" borderWidth="1.5px" color="text.subtle" />
                        )}
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {collection.items.map((item) => (
                                <Select.Item key={item.label} item={item.value}>
                                    {item.label}
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