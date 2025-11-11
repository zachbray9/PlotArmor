import { Button, ButtonProps, Image } from "@chakra-ui/react"
import { ReactNode } from "react"

const apiUrl = import.meta.env.VITE_API_URL

interface Props extends ButtonProps {
    children?: ReactNode
}

const handleClick = () => {
    const url = `${apiUrl}/auth/google/login`
    window.location.href = url
}

export default function GoogleSignInButton({children = "Sign in with Google", ...props} : Props) {
    return (
        <Button {...props} onClick={handleClick} alignItems={"center"} w={"100%"}>
            <Image src="/images/google-new.svg" boxSize={6} />
            {children}
        </Button>
    )
}