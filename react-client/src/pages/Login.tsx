import { observer } from "mobx-react-lite"
import { Box, Button, Card, Flex, Heading, Icon, Image, Stack, Text } from "@chakra-ui/react"
import FormInput from "../components/common/form/FormInput"
import { useStore } from "../stores/store"
import { NavLink } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import Logo from "../assets/PlotArmorLogo.png"
import { FormProvider, useForm } from "react-hook-form"
import { LoginFormFields, loginValidationSchema } from "../schemas/loginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { TriangleAlert } from "lucide-react"
import { BadRequestError, UnauthorizedError } from "../api/errors/httpErrors"

export default observer(function Login() {
    const { userStore } = useStore()
    const methods = useForm<LoginFormFields>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(loginValidationSchema),
        mode: "onSubmit"
    })

    const onSubmit = async (fields: LoginFormFields) => {
        try {
            await userStore.login(fields)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                methods.setError("root", { message: "Incorrect email or password." })
            }
            else if (error instanceof BadRequestError) {
                methods.setError("root", { message: "This account uses Google sign in. Please click Sign in With Google." })
            }
            else {
                methods.setError("root", { message: "Something went wrong. Please try again later." })
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>Suit up - Login to PlotArmor</title>
            </Helmet>

            <Stack width='100%' height='85svh' display='flex' justifyContent='center' alignItems='center' padding={['1.5rem', '1.75rem', '4rem']}>
                <Card.Root bg='transparent' border="none" maxWidth='31rem' width='100%' padding={['1.25rem', '1.75rem', '2rem']}>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} >
                            <Card.Header as={Stack} alignItems="center" textAlign="center" gap={2}>
                                <Image src={Logo} boxSize="75px" alt="PlotArmor Logo" />
                                <Stack gap={1}>
                                    <Heading size="3xl" textAlign="center">Welcome back</Heading>
                                    <Text color="text.subtle">Sign in to suit up and get back to exploring.</Text>
                                </Stack>
                            </Card.Header>

                            <Card.Body as={Stack} gap={4}>
                                <FormInput name="email" placeholder="Email" bg="surface.sunken" rounded="lg" _autofill={{ WebkitTextFillColor: "text", boxShadow: "0 0 0px 1000px var(--chakra-colors-surface-sunken) inset !important" }} />

                                <FormInput name="password" placeholder="Password" bg="surface.sunken" rounded="lg" _autofill={{ WebkitTextFillColor: "text", boxShadow: "0 0 0px 1000px var(--chakra-colors-surface-sunken) inset !important" }} hideable />
                            </Card.Body>

                            <Card.Footer display='flex' flexDirection='column' justifyContent='start' alignItems='center' gap={['1.25rem', '1.75', '2rem']}>
                                <Box width='100%' >
                                    {methods.formState.errors.root &&
                                        <Flex gap={1} alignItems="start">
                                            <Icon color="status.error" size="sm" mt={0.5}>
                                                <TriangleAlert />
                                            </Icon>
                                            <Text color='status.error' fontSize="sm" >{methods.formState.errors.root.message}</Text>
                                        </Flex>
                                    }
                                </Box>
                                
                                <Stack w={"100%"} gap={4} alignItems={"center"}>
                                    <Button type="submit" bg="interactive.primary" color="text" w="100%" rounded="lg" _hover={{ bg: "interactive.primary-hover" }} loading={methods.formState.isSubmitting} >Log In</Button>
                                   
                                    <Button onClick={() => window.location.href = "http://localhost:8080/api/auth/google/login"} alignItems={"center"} rounded={"lg"} w={"100%"}>
                                        <Image src="/images/google-new.svg" boxSize={6}/>
                                        Sign in with Google
                                    </Button>
                                </Stack>

                                <Flex gap={1} color="text.subtle">
                                    <Text>No account?</Text>
                                    <NavLink to="/register">
                                        <Text color='interactive.primary' _hover={{ color: 'interactive.primary-hover' }} transition='color 200ms' cursor="pointer">Create One</Text>
                                    </NavLink>
                                </Flex>
                            </Card.Footer>
                        </form>
                    </FormProvider>
                </Card.Root>

            </Stack>
        </>
    )
})