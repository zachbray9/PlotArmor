import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import '../../styles/CarouselCard.css'
import { Star } from "lucide-react"
import AddRemoveListIconButton from "../animeList/addRemoveListIconButton";
import Anime from "../../models/anime";
import useAddAnimeToList from "../../hooks/useAddAnimeToList";
import useRemoveAnimeFromList from "../../hooks/useRemoveAnimeFromList";
import { memo } from "react";
import { stripHtmlTags } from "../../utils/string";

interface Props {
    anime: Anime
    isInList: boolean
    isListLoading?: boolean
}

export default memo(function CarouselCard({ anime, isInList, isListLoading }: Props) {
    const { mutate: addToList, isPending: isAdding } = useAddAnimeToList()
    const { mutate: removeFromList, isPending: isRemoving } = useRemoveAnimeFromList()

    const cleanDescription = stripHtmlTags(anime.synopsis ?? "")

    return (
        <Stack asChild key={anime.id} position='relative' gap={2} cursor='pointer' _hover={{ '& .overlay': { opacity: 1 } }}>
            <NavLink to={`/anime/${anime.id}/details`}>
                <Image id="anime-poster" src={anime.posterImage ?? undefined} width='100%' aspectRatio='2/3' objectFit='contain' />

                <Text id="anime-title" fontSize={{ base: "xs", md: "sm" }}>{anime.englishTitle ?? anime.romajiTitle}</Text>

                <Box className='overlay' position='absolute' top='-.5rem' bottom='-.5rem' right='-.5rem' left='-.5rem' opacity={0} transition='opacity 0.2s ease' overflow='hidden'>
                    <Image src={anime.posterImage} position='absolute' top={0} bottom={0} left={0} right={0} width='100%' height='100%' objectFit='cover' />
                    <Box position='absolute' top={0} bottom={0} left={0} right={0} bg='rgb(20, 21, 25, 0.9)'>
                        <Stack height='100%' justifyContent='space-between' padding='0.5rem'>
                            <Stack gap={2}>
                                <Text fontSize='sm'>{anime.englishTitle || anime.romajiTitle}</Text>
                                <Flex alignItems="center" gap={1}>
                                    <Star size={16} />
                                    <Text fontSize='xs'>{anime.averageScore ?? 'Unscored'}</Text>
                                </Flex>
                                <Text fontSize='xs' color='text.subtle'>{(anime.episodes || '?') + ' episodes'}</Text>
                                <Text fontSize='xs' lineClamp={5}>{cleanDescription}</Text>
                            </Stack>
                            <Flex >
                                <AddRemoveListIconButton
                                    isInList={isInList}
                                    loading={isListLoading || isAdding || isRemoving}
                                    onAddToList={() => addToList(anime.id)}
                                    onRemoveFromList={() => removeFromList(anime.id)}
                                    variant="ghost"
                                    _hover={{
                                        bg: "whiteAlpha.200"
                                    }}
                                />
                            </Flex>
                        </Stack>
                    </Box>
                </Box>
            </NavLink>

        </Stack>
    )
})