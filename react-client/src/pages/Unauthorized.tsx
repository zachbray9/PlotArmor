import { Center, Heading, Icon, Text } from "@chakra-ui/react";
import { Ban } from "lucide-react";

export default function Unauthorized() {
    return (
        <Center flexDir="column">
            <Heading as={"h1"}>Unauthorized</Heading>
            <Text>You don't have permission to be here yet. Keep training.</Text>
            <Icon size={"2xl"} color={"status.error"}>
                <Ban />
            </Icon>
        </Center>
    )
}