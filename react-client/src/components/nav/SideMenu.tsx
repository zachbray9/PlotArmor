import { Accordion, AccordionItemIndicator, CloseButton, Drawer, Portal, Span, Stack } from "@chakra-ui/react";
import { navBarHeight } from "../../theme";
import SideMenuButton from "./SideMenuButton";
import useGenres from "../../hooks/useGenres";

interface Props {
    isOpen: boolean
    onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: Props) {
    const {data: genres} = useGenres()

    return (
        <Drawer.Root placement="start" open={isOpen} size={{ base: 'full', sm: 'xs' }} onInteractOutside={onClose}>
            <Portal >
                <Drawer.Backdrop mt={navBarHeight} />
                <Drawer.Positioner >
                    <Drawer.Content mt={navBarHeight} bg="background">
                        <Drawer.Header>
                            <Drawer.Title color='text.subtle'>Browse</Drawer.Title>
                        </Drawer.Header>

                        <Drawer.Body as={Stack}  overflow="auto" pb={navBarHeight} bg="background">
                            <Accordion.Root collapsible px="1rem" >
                                <Accordion.Item value="Browse">
                                    <Accordion.ItemTrigger>
                                        <Span flex="1">Genres</Span>
                                        <AccordionItemIndicator />
                                    </Accordion.ItemTrigger>

                                    <Accordion.ItemContent>
                                        <Accordion.ItemBody as={Stack} background="background.card">
                                            {
                                                genres?.map(genre => (
                                                    <SideMenuButton key={genre.id} to={`/anime/browse?genre=${genre.id}`} onClose={onClose} paddingX="2.5rem" paddingY="1.5rem" >{genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}</SideMenuButton>
                                                ))
                                            }
                                        </Accordion.ItemBody>
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            </Accordion.Root>
                        </Drawer.Body>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={onClose} />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}