import { AspectRatio, Badge, Box, Button, Flex, Grid, Heading, Image, Skeleton, Stack, Text, Wrap } from "@chakra-ui/react";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../components/common/loading/LoadingComponent";
import RatingInputForm from "../components/forms/ratingInputForm";
import WatchStatusInputForm from "../components/forms/watchStatusInputForm";
import NumEpisodesWatchedInputForm from "../components/forms/numEpisodesWatchedInputForm";
import { Helmet } from "react-helmet-async";
import CharacterCard from "../components/animeDetails/characterCard";
import { Plus, Star, Trash } from "lucide-react";
import useAnime from "../hooks/useAnime";

export default observer(function AnimeDetails() {
    const { listStore, userStore } = useStore()
    const { animeId = "0" } = useParams()
    const { userAnimeDetails } = listStore

    const {anime, isPending} = useAnime(Number.parseInt(animeId, 10))

    useEffect(() => {
        const loadUserAnime = async () => {
            if (userStore.user && anime) {
                await listStore.loadUserAnimeDetails(anime.id)
            }
        }

        loadUserAnime()

        return () => {
            listStore.clearUserAnimeDetails()
        }
    }, [anime, listStore, userStore.user])

    const averageScore = anime?.averageScore ? parseFloat((anime.averageScore * 0.1).toFixed(1)) : null

    if (isPending) {
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
                                <Skeleton loading={listStore.isLoadingUserAnimeDetails}>
                                    {userAnimeDetails ? (
                                        <Stack gap='1rem'>
                                            <RatingInputForm />
                                            <WatchStatusInputForm />
                                            <NumEpisodesWatchedInputForm />
                                            <Button variant='outline' loading={userStore.isRemovingAnimeFromList} width='fit-content' onClick={() => userStore.removeAnimeFromList(anime!.id)}>Remove from list <Trash /></Button>
                                        </Stack>
                                    ) : (
                                        <Button bg="interactive.primary" _hover={{bg: "primary.hover"}} loading={userStore.isAddingAnimeToList} width='fit-content' onClick={() => userStore.addAnimeToList(anime!.id)}>Add to list <Plus /></Button>
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
                                        src={`https://www.youtube.com/embed/${anime.trailerUrl}`}
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
})