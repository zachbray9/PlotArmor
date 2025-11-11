import { Button, ButtonProps, Image } from "@chakra-ui/react"
import { ReactNode } from "react"

const apiUrl = import.meta.env.VITE_API_URL

interface Props extends ButtonProps {
    children?: ReactNode
}

export default function GoogleSignInButton({children = "Sign in with Google", ...props} : Props) {
    return (
        <Button {...props} onClick={() => window.location.href = `${apiUrl}/auth/google/login`} alignItems={"center"} rounded={"lg"} w={"100%"}>
            <Image src="/images/google-new.svg" boxSize={6} />
            {children}
        </Button>
    )
}