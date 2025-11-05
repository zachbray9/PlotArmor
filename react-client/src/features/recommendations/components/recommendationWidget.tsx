import { Box, Flex, Heading, Icon, IconButton, Stack, Textarea } from "@chakra-ui/react";
import useRecommendations from "../hooks/useRecommendations";
import { useForm } from "react-hook-form";
import { RecommendationFormFields, RecommendationSchema } from "../../../schemas/recommendationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Sparkles } from "lucide-react";
import RecommendationCarousel from "./recommendationCarousel";
import { useMemo } from "react";
import { Recommendation } from "../types/recommendationResponse";

export default function RecommendationWidget() {
    const { mutate, data, isPending } = useRecommendations()
    const { register, handleSubmit, formState } = useForm<RecommendationFormFields>({
        defaultValues: {
            prompt: ""
        },
        resolver: zodResolver(RecommendationSchema)
    })

    const recommendations = useMemo<Recommendation[]>(() => {
        if (!data) return []
        
        return data.recommendations.map((rec, index) => ({
            anime: rec.anime,
            similarity: rec.similarity,
            reason: data.explanations[index]?.reason || ""
        }))
    }, [data])

    return (
        <Stack>
            <Flex gap={1} alignItems={"center"} paddingX={{ base: '1.25rem', md: '4rem' }}>
                <Icon>
                    <Sparkles />
                </Icon>

                <Heading as={"h2"} size={{ base: "xl", md: "3xl" }} fontWeight="semibold">AI powered recommendations</Heading>
            </Flex>
            {data && <RecommendationCarousel data={recommendations} />}


            <Box w={"full"} paddingX={{ base: '1.25rem', md: '4rem' }}>
                <form onSubmit={handleSubmit((fields) => mutate(fields.prompt))}>
                    <Box w={"full"} borderWidth={1} rounded={"lg"} >
                        <Textarea {...register("prompt")} placeholder="What type of show do you want to watch?" resize={"none"} autoresize rows={1} border={"none"} focusRing={"none"}/>
                        <Flex justify={"end"} p={4}>
                            <IconButton type="submit" loading={isPending} disabled={isPending || !formState.isDirty} size={"xs"} rounded={"sm"}>
                                <ArrowUp />
                            </IconButton>
                        </Flex>
                    </Box>
                </form>
            </Box>

        </Stack>
    )
}