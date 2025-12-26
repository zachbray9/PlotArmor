import { AspectRatio, Badge, Box, Button, Flex, Grid, GridItem, Heading, Image, Skeleton, Stack, Text, Wrap } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/common/loading/LoadingComponent";
import { Helmet } from "react-helmet-async";
import CharacterCard from "../components/animeDetails/characterCard";
import { Plus } from "lucide-react";
import useAnime from "../hooks/useAnime";
import { extractYoutubeId } from "../utils/youtube";
import useUserAnime from "../hooks/useUserAnime";
import EditEntryDrawer from "../components/animeList/editEntryDrawer";
import useAddAnimeToList from "../hooks/useAddAnimeToList";

export default function AnimeDetails() {
    const { animeId = "0" } = useParams()
    const { anime, isPending: isAnimePending } = useAnime(Number.parseInt(animeId, 10))
    const { userAnime, isPending: isUserAnimePending } = useUserAnime(Number.parseInt(animeId, 10))
    const { mutate: addAnimeToList, isPending: isAddingAnimeToList } = useAddAnimeToList()


    const formattedStartDate = anime?.startDate ? new Date(anime.startDate).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) : "?"
    const formattedEndDate = anime?.endDate ? new Date(anime.endDate).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }) : "?"
    const averageScore = anime?.averageScore ? parseFloat((anime.averageScore).toFixed(1)) : null

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

                <Stack width='100%' >
                    <Box pos="relative" width="100%" h={{ mdDown: "20dvh", lg: "60dvh" }} display="flex" flexDir="column" justifyContent="end" alignItems="center" bgImage={`url(${anime.bannerImage})`} backgroundPosition="center" backgroundSize="cover" paddingX={['1.25rem', null, '4rem']} paddingY="2rem" mb={24}>
                        <Box pos="absolute" top={0} bottom={0} right={0} left={0} bg="background" opacity={0.8} zIndex={1} />

                        <Grid zIndex={2} maxW="6xl" w="100%" templateColumns="3fr 7fr" gap={8}>
                            <GridItem position="relative">
                                <Image position="absolute" bottom="-20" src={anime?.posterImage} aspectRatio='2/3' maxHeight="md" rounded="sm" />
                            </GridItem>

                            <GridItem display="flex" flexDir="column" justifyContent="end">
                                {/* Title */}
                                <Heading visibility={{ lgDown: "hidden" }} size='4xl' mb={1}>{anime?.englishTitle || anime?.romajiTitle}</Heading>


                                {/* Media Type and season */}
                                <Text visibility={{ lgDown: "hidden" }} fontSize='xs' color='text.subtle' mb={8}>{`${anime?.format} - ${anime?.season.charAt(0).toUpperCase() + anime?.season.slice(1).toLowerCase()} ${anime?.seasonYear}`}</Text>

                                <Flex mb={8} position={{ lgDown: "absolute" }} bottom="-20">
                                    {/* List controls */}
                                    <Skeleton loading={isUserAnimePending}>
                                        {userAnime ? (
                                            <EditEntryDrawer userAnime={userAnime} />
                                        ) : (
                                            <Button bg="interactive.primary" size={{ smDown: "xs", md: "md" }} color="text" rounded="sm" _hover={{ bg: "primary.hover" }} loading={isAddingAnimeToList} width='fit-content' onClick={() => addAnimeToList(parseInt(animeId))}>Add to list <Plus /></Button>
                                        )}
                                    </Skeleton>
                                </Flex>

                                {/* Genres */}
                                <Wrap visibility={{ lgDown: "hidden" }}>
                                    {anime?.genres && anime.genres.map((genre) => (
                                        <Badge key={genre.id} borderRadius={14} width='fit-content' paddingX={2} fontSize='xs'>{genre.name}</Badge>
                                    ))}
                                </Wrap>
                            </GridItem>

                        </Grid>
                    </Box>
                    <Stack width='100%' justifyContent='center' alignItems={{ mdDown: "start", lg: 'center' }} gap='1rem' padding="1rem">
                        <Heading visibility={{ lg: "hidden" }} alignItems="start" size='2xl' mb={1}>{anime?.englishTitle || anime?.romajiTitle}</Heading>

                        <Grid maxW="6xl" w="100%" templateColumns={{ mdDown: "1fr", lg: "3fr 7fr" }} gap={8}>
                            <GridItem overflow="hidden">
                                <Box display="flex" flexDir={{ mdDown: "row", lg: "column" }} gap={4} overflowX="auto" textWrap="nowrap" padding={2}>
                                    <Box>
                                        <Heading as={"h5"} size="sm" >Average score</Heading>
                                        <Text fontSize="sm" color="text.subtle">{averageScore}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm" >Format</Heading>
                                        <Text fontSize="sm" color="text.subtle">{anime.format}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">Episodes</Heading>
                                        <Text fontSize="sm" color="text.subtle">{anime.episodes ?? "?"}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm" >Episode duration</Heading>
                                        <Text fontSize="sm" color="text.subtle">{anime.duration ?? "?"}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">Status</Heading>
                                        <Text fontSize="sm" color="text.subtle">{anime.status}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">Start date</Heading>
                                        <Text fontSize="sm" color="text.subtle">{formattedStartDate}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">End date</Heading>
                                        <Text fontSize="sm" color="text.subtle">{formattedEndDate}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">Season</Heading>
                                        <Text fontSize="sm" color="text.subtle">{`${anime.season.charAt(0) + anime.season.slice(1).toLowerCase()} ${anime.seasonYear}`}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">Studios</Heading>
                                        <Box>
                                            {anime.studios.map((studio) => (
                                                <Text key={studio.id} fontSize="sm" color="text.subtle">{studio.name}</Text>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">Genres</Heading>
                                        <Box display="flex" flexDir={{mdDown: "row", lg: "column"}} gap={1}>
                                            {anime.genres.map((genre) => (
                                                <Text key={genre.id} fontSize="sm" color="text.subtle">{genre.name}</Text>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">English</Heading>
                                        <Text fontSize="sm" color="text.subtle">{anime.englishTitle}</Text>
                                    </Box>

                                    <Box>
                                        <Heading as={"h5"} size="sm">Romaji</Heading>
                                        <Text fontSize="sm" color="text.subtle">{anime.romajiTitle}</Text>
                                    </Box>
                                </Box>

                            </GridItem>

                            <GridItem>
                                <Stack gap={8}>
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

                            </GridItem>

                        </Grid>




                    </Stack>
                </Stack>
            </>
        )
    }
}