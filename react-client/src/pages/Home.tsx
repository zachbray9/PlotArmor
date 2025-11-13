import { Stack } from "@chakra-ui/react"
import { Helmet } from "react-helmet-async"
import { observer } from "mobx-react-lite"
import AnimeCarousel from "../components/carousels/AnimeCarousel"
import FeaturedCarousel from "../components/carousels/FeaturedCarousel"
import useHomePageData from "../hooks/useHomePageData"
import RecommendationWidget from "../features/recommendations/components/recommendationWidget"

export default observer(function Home() {
    const { featuredShows, topAiring, popularShows, upcomingShows, isPending } = useHomePageData()

    return (
        <>
            <Helmet>
                <title>PlotArmor - Explore, rate, and keep track of your favorite anime</title>
            </Helmet>

            <Stack as="main" gap='4rem' overflow='hidden'>
                <FeaturedCarousel data={featuredShows} />

                <RecommendationWidget />

                <Stack gap={{ base: '2rem', md: "4rem" }}>
                    <AnimeCarousel heading='Top Airing' data={topAiring} isLoading={isPending} />
                    <AnimeCarousel heading='Popular' data={popularShows} isLoading={isPending} />
                    <AnimeCarousel heading='Upcoming' data={upcomingShows} isLoading={isPending} />
                </Stack>
            </Stack>
        </>
    )
})