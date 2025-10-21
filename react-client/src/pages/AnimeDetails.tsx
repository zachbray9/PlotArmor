import { AspectRatio, Badge, Box, Button, Flex, Grid, Heading, Image, Skeleton, Stack, Text, Wrap } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/common/loading/LoadingComponent";
import { Helmet } from "react-helmet-async";
import CharacterCard from "../components/animeDetails/characterCard";
import { Plus, Star } from "lucide-react";
import useAnime from "../hooks/useAnime";
import { extractYoutubeId } from "../utils/youtube";
import useUserAnime from "../hooks/useUserAnime";
import EditEntryDrawer from "../components/animeList/editEntryDrawer";
import useAddAnimeToList from "../hooks/useAddAnimeToList";

export default function AnimeDetails() {
    const { animeId = "0" } = useParams()
    const {anime, isPending: isAnimePending} = useAnime(Number.parseInt(animeId, 10))
    const {userAnime, isPending: isUserAnimePending} = useUserAnime(Number.parseInt(animeId, 10))
    const {mutate: addAnimeToList, isPending: isAddingAnimeToList} = useAddAnimeToList()

    

    const averageScore = anime?.averageScore ? parseFloat((anime.averageScore * 0.1).toFixed(1)) : null

    if (isAnimePending) {
        return (
            <LoadingComponent text="Loading anime..." />
        )
    }

    if (anime) {
        return (
            <>
                <Helmet>
                    <title>{`${anime?.englishTitle || anime?.romajiTitle} - PlotArmor`}</title>
                </Helmet>

                <Box padding={['1.25rem', null, '4rem']} display='flex' alignItems='start' justifyContent='center' width='100%' >
                    <Stack maxWidth='1200px' width='100%' justifyContent='center' alignItems='center' gap='8rem'>
                        <Flex justify='center' wrap='wrap' gap='2rem' >
                            <Image src={anime?.posterImage} aspectRatio='2/3' maxHeight="md"/>
                            <Stack gap={4}>
                                {/* Title */}
                                <Heading size='3xl'>{anime?.englishTitle || anime?.romajiTitle}</Heading>

                                {/* Genres */}
                                <Wrap>
                                    {anime?.genres && anime.genres.map(genre => (
                                        <Badge key={genre.id} variant='subtle' borderRadius={14} width='fit-content' paddingX={2} color='gray.500' fontSize='xs'>{genre.name}</Badge>
                                    ))}
                                </Wrap>

                                {/* Media Type and season */}
                                <Text fontSize='xs' color='text.subtle'>{`${anime?.format} | ${anime?.season} ${anime?.seasonYear}`}</Text>

                                {/* Score */}
                                <Flex align='center' justify='start' gap={1}>
                                    <Star size={24} color="yellow" fill="yellow"/>
                                    <Text fontSize='1.25rem'>{averageScore ?? 'Unscored'}</Text>
                                </Flex>

                                {/* List controls */}
                                <Skeleton loading={isUserAnimePending}>
                                    {userAnime ? (
                                        <EditEntryDrawer userAnime={userAnime}/>
                                    ) : (
                                        <Button bg="interactive.primary" _hover={{bg: "primary.hover"}} loading={isAddingAnimeToList} width='fit-content' onClick={() => addAnimeToList(parseInt(animeId))}>Add to list <Plus /></Button>
                                    )}
                                </Skeleton>
                            </Stack>
                        </Flex>


                        {/* Synopsis */}
                        <Stack gap='1rem' width='100%'>
                            <Heading size='md'>Synopsis</Heading>
                            {anime?.synopsis ? (
                                <Text whiteSpace="pre-line">{anime.synopsis.replace(/\\n/g, '\n')}</Text>
                            ) : (
                                <Text>No synopsis</Text>
                            )}
                        </Stack>

                        {/* trailer */}
                        <Stack gap='1rem' width='100%'>
                            <Heading size='md'>Trailer</Heading>
                            {anime?.trailerUrl ? (
                                <AspectRatio ratio={4 / 3} maxWidth={560}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${extractYoutubeId(anime.trailerUrl)}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </AspectRatio>
                            ) : (
                                <Text>No trailer</Text>
                            )}
                        </Stack>

                        {/* Characters */}
                        <Stack gap='1rem' width='100%'>
                            <Heading size='md'>Characters</Heading>
                            <Grid templateColumns={['1fr', null, '1fr 1fr', '1fr 1fr 1fr']} rowGap='1rem' columnGap='2rem'>
                                {anime?.characters ? (
                                    anime.characters.map((character) => (
                                        <CharacterCard character={character} key={character.name} />
                                    ))
                                ) : (
                                    <Text>No characters</Text>
                                )}

                            </Grid>
                        </Stack>

                    </Stack>
                </Box>
            </>
        )
    }
}