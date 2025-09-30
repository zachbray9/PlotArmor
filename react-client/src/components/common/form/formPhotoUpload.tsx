import { Box, Field, FileUpload, Icon } from "@chakra-ui/react"
import { useField, useFormikContext } from "formik"
import { LucideUploadCloud } from "lucide-react"
interface Props {
    name: string
    label: string
    required?: boolean
}

export default function FormPhotoUpload({ name, label, required }: Props) {
    const [field, meta] = useField(name)
    const { setFieldValue } = useFormikContext()

    return (
        <Field.Root invalid={meta.touched && !!meta.error} required={required} w="100%">
            <Field.Label>
                {label}
                <Field.RequiredIndicator color="status.error" />
            </Field.Label>

            <FileUpload.Root
                w="100%"
                maxFiles={1}
                maxFileSize={5000000}
                accept={["image/jpeg", "image/png", "image/webp"]}
                onFileAccept={(files) => {
                    setFieldValue(name, files.files[0])
                }}
            >
                <FileUpload.HiddenInput />
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
                    {field.value && 
                        <FileUpload.Item file={field.value}>
                            <FileUpload.ItemPreviewImage />
                            <FileUpload.ItemPreview />
                            <FileUpload.ItemName />
                            <FileUpload.ItemSizeText />
                            <FileUpload.ItemDeleteTrigger onClick={() => setFieldValue(name, null)}/>
                        </FileUpload.Item>
                    }
                </FileUpload.ItemGroup>
            </FileUpload.Root>

            {meta.touched && meta.error && (
                <Field.ErrorText>{meta.error}</Field.ErrorText>
            )}
        </Field.Root>
    )
}