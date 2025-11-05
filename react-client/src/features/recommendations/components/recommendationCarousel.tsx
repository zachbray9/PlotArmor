import { Box, useBreakpointValue } from "@chakra-ui/react"
import { CustomNextCarouselArrow, CustomPrevCarouselArrow, usePrevNextButtons } from "../../../components/carousels/customCarouselArrowButtons"
import useUserAnimeList from "../../../hooks/useUserAnimeList"
import useEmblaCarousel from "embla-carousel-react"
import { Recommendation } from "../types/recommendationResponse"
import RecommendationCard from "./recommendationCard"

interface Props {
    data: Recommendation[],
}

export default function RecommendationCarousel({ data }: Props) {
    const {animeIds, isPending: isListPending} = useUserAnimeList()
    const slidesToScroll = useBreakpointValue<number>({ base: 2, sm: 3, md: 4, lg: 5, xl: 6, xxl: 7 })
    const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: slidesToScroll })
    const { onPrevButtonClick, onNextButtonClick, prevBtnDisabled, nextBtnDisabled } = usePrevNextButtons(emblaApi)

    return (
        <Box className="carousel-main-wrapper" gap={{ base: '0.5rem', md: '1rem' }} paddingX={{ base: '1.25rem', md: '4rem' }} overflow='hidden' >
            <Box pos="relative">
                <Box ref={emblaRef}>
                    <Box display="flex">
                        {data.map((rec) => (
                            <Box key={rec.anime.id} flexGrow={0} flexShrink={0} flexBasis={["44%", "30%", "25%", "20%", "17%", "13%"]} mr={6}>
                                <RecommendationCard key={rec.anime.id} anime={rec.anime} similarityScore={rec.similarity} explanation={rec.reason} isInList={animeIds.includes(rec.anime.id)} isListLoading={isListPending}/>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <CustomPrevCarouselArrow onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                <CustomNextCarouselArrow onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </Box>
        </Box>
    )
}