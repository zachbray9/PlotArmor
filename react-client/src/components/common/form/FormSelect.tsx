import { Field, ListCollection, Portal, Select, Spinner } from '@chakra-ui/react';
import { SelectOption } from "../../../models/selectOption";
import { useController, useFormContext } from "react-hook-form";

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

export default function FormSelect({ name, label, collection, isSubmitting, multiple, loading }: Props) {
    const { control, formState: {touchedFields, errors} } = useFormContext()
    const {field: {onChange, onBlur, value, ref}} = useController({name, control})

    const fieldError = errors[name]
    const errorMessage = fieldError?.message as string | undefined
    const isTouched = touchedFields[name]

    return (
        <Field.Root invalid={isTouched && !!fieldError} >
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <Select.Root
                collection={collection}
                value={value}
                disabled={isSubmitting}
                onValueChange={({value}) => onChange(value)}
                onBlur={onBlur}
                multiple={multiple}
                ref={ref}
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

            {isTouched && fieldError && (
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            )}
        </Field.Root>
    )
}