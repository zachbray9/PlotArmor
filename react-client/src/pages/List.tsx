import { Box, Grid, GridItem, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import AnimeListEntry from "../components/animeList/animeListEntry";
import FilterSection from "../components/animeList/filterSection";
import useUserAnimeList from "../hooks/useUserAnimeList";
import { useMemo, useState } from "react";

export default function List() {
    const { animeList, isPending } = useUserAnimeList()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [watchStatusFilter, setWatchStatusFilter] = useState<string | null>(null)
    // const [genresFilter, setGenresFilter] = useState<number[]>([])
    const [sortPreference, setSortPreference] = useState<string>("TITLE")

    const filteredList = useMemo(() => {
        let list = animeList
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            list = list?.filter((ua) => ua.anime.englishTitle.toLowerCase().includes(query) || ua.anime.romajiTitle.toLowerCase().includes(query))
        }
        if (watchStatusFilter) list = list?.filter((ua) => ua.watchStatus === watchStatusFilter)

        switch (sortPreference) {
            case "TITLE":
                list?.sort((a, b) => a.anime.englishTitle.localeCompare(b.anime.englishTitle))
                break
            case "RATING":
                list?.sort((a, b) => b.rating - a.rating)
                break
            case "PROGRESS":
                list?.sort((a, b) => b.numEpisodesWatched - a.numEpisodesWatched)
                break
            default:
                break
        }

        return list
    }, [animeList, searchQuery, sortPreference, watchStatusFilter])

    return (
        <>
            <Helmet>
                <title>Anime List - PlotArmor</title>
            </Helmet>

            <Box padding={['1.25rem', null, '4rem']} display='flex' alignItems='start' justifyContent='center' width='100%'>
                <Stack maxWidth='1600px' width='100%' justifyContent='start' alignItems='start' gap={['1rem', '1.5rem', '4rem']}>
                    <Heading>My list</Heading>

                    <Grid templateColumns={['1fr', null, '1fr 3fr', '1fr 5fr']} gap='2rem' width='100%'>
                        <GridItem>
                            <FilterSection
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                watchStatusFilter={watchStatusFilter}
                                onWatchStatusChange={setWatchStatusFilter}
                                sortPreference={sortPreference}
                                onSortChange={setSortPreference}
                            />
                        </GridItem>

                        <GridItem as={Stack} alignItems='end' gap='1rem'>
                            <Text color='text.subtle'>{`${filteredList?.length ?? 0} entries`}</Text>

                            <Grid gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xlOnly: "repeat(4, 1fr)", xlTo2xl: "repeat(5, 1fr)" }} gap={4} alignItems="stretch" width='100%'>
                                {isPending ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <Skeleton key={index} w="100%" h="200px" rounded="lg" />
                                    ))
                                ) : (
                                    filteredList?.map(userAnime => (
                                        <AnimeListEntry userAnime={userAnime} key={userAnime.id} />
                                    ))
                                )}
                            </Grid>
                        </GridItem>

                    </Grid>
                </Stack>
            </Box>
        </>
    )
}