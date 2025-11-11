import { Box, Button, Card, Flex, Heading, Icon, Image, Stack, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import FormInput from "../components/common/form/FormInput";
import { useStore } from "../stores/store";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Logo from "../assets/PlotArmorLogo.png"
import { FormProvider, useForm } from "react-hook-form";
import { RegisterFormFields, registerValidationSchema } from "../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { ConflictError } from "../api/errors/httpErrors";
import GoogleSignInButton from "../components/ui/googleSignInButton";

export default observer(function Register() {
    const { userStore } = useStore()
    const methods = useForm<RegisterFormFields>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        resolver: zodResolver(registerValidationSchema),
        mode: "onSubmit"
    })

    const onSubmit = async (fields: RegisterFormFields) => {
        try {
            await userStore.register(fields)
        } catch (error) {
            if (error instanceof ConflictError) {
                methods.setError("root", { message: "An account with this email already exists." })
            }
            else {
                methods.setError("root", { message: "Something went wrong. Please try again later." })
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>Unlock your armor - Sign up for PlotArmor</title>
            </Helmet>

            <Box width='100%' height='85svh' display='flex' justifyContent='center' alignItems='center' padding={['1.5rem', '1.75rem', '4rem']} position='relative'>
                <Card.Root bg="transparent" border="none" maxWidth='31rem' width='100%' padding={['1.25rem', '1.75rem', '2rem']}>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} >
                            <Card.Header as={Stack} alignItems="center" textAlign="center" gap={2}>
                                <Image src={Logo} alt="PlotArmor Logo" boxSize="75px" />

                                <Stack gap={1}>
                                    <Heading size="3xl" textAlign="center">Gear Up, Hero</Heading>
                                    <Text color="text.subtle">Sign up to never lose track of your anime journey again.</Text>
                                </Stack>
                            </Card.Header>

                            <Card.Body as={Stack} gap={4}>
                                <FormInput name="email" placeholder="Email" bg="surface.sunken" _autofill={{ WebkitTextFillColor: "text", boxShadow: "0 0 0px 1000px var(--chakra-colors-surface-sunken) inset !important" }} />

                                <FormInput name="password" placeholder="Password" bg="surface.sunken" _autofill={{ WebkitTextFillColor: "text", boxShadow: "0 0 0px 1000px var(--chakra-colors-surface-sunken) inset !important" }} hideable />

                                <FormInput name="confirmPassword" placeholder="Confirm Password" bg="surface.sunken" _autofill={{ WebkitTextFillColor: "text", boxShadow: "0 0 0px 1000px var(--chakra-colors-surface-sunken) inset !important" }} hideable />
                            </Card.Body>

                            <Card.Footer display='flex' flexDirection='column' justifyContent='start' alignItems='center' gap={['1.25rem', '1.75', '2rem']}>
                                <Box width='100%' >
                                    {methods.formState.errors.root &&
                                        <Flex gap={1} alignItems="start">
                                            <Icon color="status.error" size="sm" mt={0.5}>
                                                <TriangleAlert />
                                            </Icon>
                                            <Text color='status.error' fontSize="sm">{methods.formState.errors.root.message}</Text>
                                        </Flex>
                                    }
                                </Box>

                                <Stack w={"100%"} alignItems={"center"} gap={4}>
                                    <Button type="submit" bg="interactive.primary" color="text" w="100%" _hover={{ bg: "interactive.primary-hover" }} loading={methods.formState.isSubmitting} >Create Account</Button>
                                    <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
                                </Stack>


                                <Flex gap={1} color={"text.subtle"}>
                                    <Text>Already have an account?</Text>
                                    <NavLink to="/login">
                                        <Text color='interactive.primary' _hover={{ color: 'interactive.primary-hover' }} transition='all 0.3s'>Log In</Text>
                                    </NavLink>
                                </Flex>

                            </Card.Footer>
                        </form>
                    </FormProvider>
                </Card.Root>

            </Box>
        </>
    )
})