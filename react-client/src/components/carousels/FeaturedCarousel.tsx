import { Badge, Box, Button, Flex, Heading, Skeleton, Stack, Text, Wrap } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { CustomFeaturedNextArrow, CustomFeaturedPrevArrow, usePrevNextButtons } from "./customCarouselArrowButtons";
import CustomDot, { useDotButton } from "./customDot";
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import useAutoPlay from "./autoplay";
import { useState } from "react";
import { MoveRight } from "lucide-react";
import AddRemoveListIconButton from "../animeList/addRemoveListIconButton";
import Anime from "../../models/anime";
import useUserAnimeList from "../../hooks/useUserAnimeList";
import useAddAnimeToList from "../../hooks/useAddAnimeToList";
import useRemoveAnimeFromList from "../../hooks/useRemoveAnimeFromList";

interface Props {
    data: Anime[]
    isLoading?: boolean
}

const DELAY: number = 10000 //in milliseconds

export default function FeaturedCarousel({ data, isLoading }: Props) {
    const {animeIds, isPending: isLoadingList} = useUserAnimeList()
    const {mutate: addToList, isPending: isAddingAnime} = useAddAnimeToList()
    const {mutate: removeFromList, isPending: isRemovingAnime} = useRemoveAnimeFromList()
    const [isHovered, setIsHovered] = useState(false)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])
    const { onStart, onPause } = useAutoPlay(emblaApi, DELAY)
    const { onNextButtonClick, onPrevButtonClick } = usePrevNextButtons(emblaApi)
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>/g, ''); // Removes anything between < and >
    }

    const onHover = () => {
        setIsHovered(true)
        onPause()
    }

    const onUnhover = () => {
        setIsHovered(false)
        onStart()
    }

    if (isLoading) {
        return (
            <Box id="featured" pos="relative" display="flex" flexDir="column" gap={4}>
            <Box 
                height={['60vh', null, '70vh']}
                width="100%"
                position="relative"
                display="flex"
                alignItems={['end', null, 'center']}
                justifyContent='left'
            >
                <Skeleton height="100%" width="100%" position="absolute" top={0} left={0} right={0} bottom={0} />
                
                {/* Gradient overlay - same as the actual carousel */}
                <Box 
                    zIndex={1} 
                    position='absolute' 
                    bottom={0} 
                    width={'100%'} 
                    height={'75%'} 
                    bgGradient='to-b' 
                    gradientFrom="transparent" 
                    gradientTo="background" 
                />
                
                {/* Content skeletons */}
                <Box 
                    zIndex={2}
                    marginTop={[null, '10%']} 
                    width='100%'
                    paddingX={[4, null, 40]} 
                    paddingY={[4, null, 0]}
                >
                    <Stack maxW={["100%", null, "70%", null, "50%"]} w={"100%"} gap={4} alignItems={["center", null, "start"]}>
                        <Skeleton height={["40px", null, "60px", "80px"]} width="70%" />
                        <Wrap gap={1}>
                            <Skeleton height={3} width={8} borderRadius="full" />
                            <Skeleton height={3} width={8} borderRadius="full" />
                            <Skeleton height={3} width={8} borderRadius="full" />
                        </Wrap>
                        <Skeleton display={{ base: 'none', md: 'block' }} height="80px" width="100%" />
                        <Flex gap={2} width={['100%', 'auto']}>
                            <Skeleton height="40px" width={['100%', '150px']} borderRadius="md" />
                            <Skeleton height="40px" width="40px" borderRadius="md" />
                        </Flex>
                    </Stack>
                </Box>
            </Box>
            
            <Box w="100%" display="flex" justifyContent="center">
                <Flex gap={2}>
                    <Skeleton height={1.5} width={8} borderRadius="full" />
                    <Skeleton height={1.5} width={4} borderRadius="full" />
                    <Skeleton height={1.5} width={4} borderRadius="full" />
                </Flex>
            </Box>
        </Box>
        )
    }

    return (
        <Box id="featured" pos="relative" display="flex" flexDir="column" gap={4}>
            <Box id="featured-viewport" ref={emblaRef} >
                <Box id="featured-container" display="flex" >
                    {data.map((anime) => (
                        <Box
                            key={anime.id}
                            id="featured-slide"
                            flexGrow="0"
                            flexShrink="0"
                            flexBasis="100%"
                            minW={0}
                            maxW="100%"
                            bgImage={[`url(${anime.posterImage})`, `url(${anime.bannerImage})`]}
                            position='relative'
                            height={['60vh', null, '70vh']}
                            backgroundPosition='center'
                            backgroundSize='cover'
                            display='flex'
                            alignItems={['end', null, 'center']}
                            justifyContent='left'
                            overflow='visible'
                        >
                            <Box id="featured-slide-overlay" zIndex={1} position='absolute' bottom={0} width={'100%'} height={'75%'} bgGradient='to-b' gradientFrom="transparent" gradientTo="background" display='flex' />

                            <Stack id="featured-slide-content" zIndex={2} marginTop={[null, '10%']} width='100%' paddingX={[4, null, 40]} paddingY={[4, null, 0]}>
                                <Stack maxW={["100%", null, "70%", null, "50%"]} w={"100%"} gap={4} alignItems={["center", null, "start"]} onMouseEnter={onHover} onMouseLeave={onUnhover}>
                                    <Heading size={['xl', null, "2xl", '4xl']} textAlign={['center', null, 'left']}>{anime.englishTitle ?? anime.romajiTitle}</Heading>

                                    <Wrap gap={1} justifyContent="center">
                                        {anime.genres?.map((genre) => (
                                            <Badge key={genre.id} bg="blackAlpha.400" borderRadius="full" px={2}>{genre.name}</Badge>
                                        ))}
                                    </Wrap>

                                    <Text display={{ base: 'none', md: '-webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4' }} overflow='hidden' textOverflow='ellipsis'>{stripHtml(anime.synopsis!)}</Text>

                                    <Flex width={['100%', 'auto']} gap={2} justifyContent="center">
                                        <NavLink to={`/anime/${anime.id}/details`}>
                                            <Button bg='interactive.primary' color="text" _hover={{bg: "interactive.primary-hover"}} width={['100%', 'fit-content']} >
                                                Check it out <MoveRight />
                                            </Button>
                                        </NavLink>

                                        <AddRemoveListIconButton
                                            isInList={animeIds.includes(anime.id)}
                                            loading={isLoadingList || isRemovingAnime || isAddingAnime}
                                            onAddToList={() => addToList(anime.id)}
                                            onRemoveFromList={() => removeFromList(anime.id)}
                                            variant="ghost"
                                            color="text"
                                            
                                            _hover={{ bg: "whiteAlpha.200" }}
                                        />
                                    </Flex>

                                </Stack>
                            </Stack>
                        </Box>
                    ))}
                </Box>
            </Box>

            <CustomFeaturedPrevArrow onClick={onPrevButtonClick} />
            <CustomFeaturedNextArrow onClick={onNextButtonClick} />
            <Box w="100%" display="flex" justifyContent="center">
                <Box id="featured-dots" w="fit-content" display="flex" justifyContent="center" onMouseEnter={onHover} onMouseLeave={onUnhover}>
                    {scrollSnaps.map((_, index) => (
                        <CustomDot key={index} onClick={() => onDotButtonClick(index)} isActive={selectedIndex === index ? true : false} isHovered={isHovered} delay={DELAY} />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}