import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Grid, Menu, Portal } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import useGenres from "../../hooks/useGenres";

// const categories: string[] = ["new", "popular", "trending"]

export default function BrowseMenu() {
    const {data} = useGenres()

    return (
        <Menu.Root>
            <Menu.Trigger asChild h="100%" display={{ base: "none", sm: "none", md: "flex" }}>
                <Button variant="ghost" _hover={{ bg: "background" }} _expanded={{ bg: "background" }} size="sm" h="100%" outline="none">Browse <ChevronDownIcon /></Button>
            </Menu.Trigger>

            <Portal>
                <Menu.Positioner>
                    <Menu.Content bg="background.secondary">
                        <Grid width='600px' templateColumns='1fr'>
                            {/* <Box maxWidth='300px'>
                                <Menu.ItemGroup>
                                    {categories.map((category, index) => (
                                        <Menu.Item key={index} asChild value={category}>
                                            <NavLink to={`/anime/browse/${category}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</NavLink>
                                        </Menu.Item>
                                    ))}
                                </Menu.ItemGroup>
                            </Box> */}

                            <Box borderLeft='.125rem solid #23252b'>
                                <Menu.ItemGroup title="Genres" color='text.subtle'>
                                    <Grid templateColumns='repeat(3, 1fr)' columnGap='1rem'>
                                        {data?.map((genre, index) => (
                                            <Menu.Item key={index} asChild value={genre.name}>
                                                <NavLink to={`/anime/browse?genre=${genre.id}`}>{genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}</NavLink>
                                            </Menu.Item>
                                        ))}
                                    </Grid>
                                </Menu.ItemGroup>
                            </Box>
                        </Grid>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}