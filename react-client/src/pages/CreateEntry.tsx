import { Formik } from "formik";
import FormInput from "../components/common/form/FormInput";
import { Button, Stack } from "@chakra-ui/react";
import FormSelect from "../components/common/form/FormSelect";
import FormNumberInput from "../components/common/form/formNumberInput";

export default function CreateEntry() {
    const handleSubmit = () => {
        //upload images and return s3 keys

        //send create anime request using form data and s3 image keys

        //if create anime fails, catch and clean up created images in s3
    }

    return (
        <Stack w="100%" alignItems="center">
            <Formik
            initialValues={{"title": ""}}
            onSubmit={handleSubmit}
            >
                {({resetForm}) => (
                    <Stack gap={4} maxWidth="3xl" w="100%">
                        <FormInput name="englishTitle" label="English title" required={true}/>
                        <FormInput name="romajiTitle" label="Romaji title" required={true}/>
                        <FormInput name="synopsis" label="Synopsis" required/>
                        <FormInput name="format" label="Format" required/>
                        <FormSelect name="genres" label="Genres" multiple required options={[{value: "Action", label: "Action"}, {value: "Adventure", label: "Adventure"}]}/>
                        <FormNumberInput name="episodes" label="Episodes" min={0} max={undefined} required />

                        <Button type="submit">Submit</Button>
                    </Stack>
                )}
            </Formik>
        </Stack>
    )
}