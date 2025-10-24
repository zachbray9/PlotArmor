import { Box, Grid, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import CarouselCard from "../components/carousels/CarouselCard";
import '../styles/CarouselCard.css'
import { useInfiniteQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";
import InfiniteScrollTrigger from "../components/common/loading/InfiniteScrollTrigger";
import useUserAnimeList from "../hooks/useUserAnimeList";
import LoadingComponent from "../components/common/loading/LoadingComponent";

export default function Browse() {
    const { animeIds, isPending: isUserListLoading } = useUserAnimeList()
    const [searchParams] = useSearchParams();
    const genreIdFromUrl = Number(searchParams.get('genre')) || 0;

    const fetchAnimeByGenre = async ({pageParam = 1}) => {
        const res = await myApiAgent.Animes.getbyGenre({ genreId: genreIdFromUrl, page: pageParam, limit: 20 })

        if (!res.data) {
            throw new Error("Failed to fetch anime by genre")
        }

        return res.data
    }

    const { data, isFetchingNextPage, isPending, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["animeByGenre", genreIdFromUrl],
        queryFn: fetchAnimeByGenre,
        enabled: genreIdFromUrl > 0,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasMore
                ? lastPage.pagination.currentPage + 1
                : undefined;
        },
        staleTime: 5 * 60 * 1000
    })

    // Flatten all pages into single array
    const animeList = data?.pages.flatMap(page => page.results) || [];
    const genreName = data?.pages[0]?.genre.name || "Genre";
    const genreDescription = data?.pages[0].genre.description || ""

    // Show loading skeleton for initial load
    if (isPending && genreIdFromUrl > 0) {
        return (
            <>
                <Helmet>
                    <title>Browse Anime - PlotArmor</title>
                </Helmet>

                <LoadingComponent text="Loading shows..."/>
            </>
        );
    }

    // ✅ Fix 4: Show message if no genre selected
    if (genreIdFromUrl === 0) {
        return (
            <>
                <Helmet>
                    <title>Browse Anime - PlotArmor</title>
                </Helmet>

                <Box display='flex' justifyContent='center' width='100%'>
                    <Stack alignItems='center' maxWidth='1200px' width='100%' gap='1.5rem' paddingX={['1rem', '1.5rem', '2rem', '4rem']} paddingY={['1rem', '1.25rem', '2rem']}>
                        <Text>Please select a genre to browse</Text>
                    </Stack>
                </Box>
            </>
        );
    }


    return (
        <>
            <Helmet>
                <title>{`${genreName} Anime Shows and Movies - PlotArmor`}</title>
            </Helmet>

            <Box display='flex' justifyContent='center' width='100%'>
                <Stack alignItems='center' maxWidth='1200px' width='100%' gap='1.5rem' paddingX={['1rem', '1.5rem', '2rem', '4rem']} paddingY={['1rem', '1.25rem', '2rem']}>
                    <Stack width='100%' alignItems='center'>
                        <Heading>{genreName}</Heading>
                        <Text>{genreDescription}</Text>
                    </Stack>

                    <Grid
                        templateColumns={{
                            base: 'repeat(2, 1fr)',
                            sm: 'repeat(3, 1fr)',
                            md: 'repeat(4, 1fr)',
                            lg: 'repeat(5, 1fr)',
                            xl: 'repeat(6, 1fr)',
                            xlTo2xl: 'repeat(7, 1fr)'
                        }}
                        gap={['1rem', '1.5rem', '2rem']}
                    >
                        {animeList.map((anime) => (
                            <CarouselCard key={anime.id} anime={anime} isInList={animeIds.includes(anime.id)} isListLoading={isUserListLoading} />
                        ))}
                    </Grid>

                    <InfiniteScrollTrigger onLoadMore={() => fetchNextPage} hasMore={hasNextPage || false} isLoading={isFetchingNextPage} />
                </Stack>
            </Box >
        </>
    )
}

export const sortValues = [
    'new',
    'popular',
    'trending'
]