import { Box, Field, FileUpload, Icon } from "@chakra-ui/react"
import { LucideUploadCloud } from "lucide-react"
import { useController, useFormContext } from "react-hook-form"
interface Props {
    name: string
    label: string
    required?: boolean
}

export default function FormPhotoUpload({ name, label }: Props) {
    const { control, formState: { touchedFields, errors, } } = useFormContext()
    const { field: { value, onChange, onBlur } } = useController({ name, control })

    const fieldError = errors[name]
    const errorMessage = fieldError?.message as string | undefined
    const isTouched = touchedFields[name]

    return (
        <Field.Root invalid={isTouched && !!fieldError} w="100%">
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <FileUpload.Root
                w="100%"
                maxFiles={1}
                maxFileSize={5000000}
                accept={["image/jpeg", "image/png", "image/webp"]}
                onFileAccept={(value) => onChange(value.files[0])}
            >
                <FileUpload.HiddenInput onBlur={onBlur} />
                <FileUpload.Dropzone w="100%">
                    <Icon color="text.subtle">
                        <LucideUploadCloud />
                    </Icon>
                    <FileUpload.DropzoneContent>
                        <Box>Drag and drop files here</Box>
                        <Box color="text.subtle">.png, .jpg, .webp up to 5MB</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>

                <FileUpload.ItemGroup>
                    {value &&
                        <FileUpload.Item file={value}>
                            <FileUpload.ItemPreviewImage />
                            <FileUpload.ItemPreview />
                            <FileUpload.ItemName />
                            <FileUpload.ItemSizeText />
                            <FileUpload.ItemDeleteTrigger onClick={() => onChange(null)} />
                        </FileUpload.Item>
                    }
                </FileUpload.ItemGroup>
            </FileUpload.Root>

            {isTouched && fieldError && (
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            )}
        </Field.Root>
    )
}