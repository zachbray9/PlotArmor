import { Box, Button, Flex, Heading, Icon, IconButton, Stack, Textarea, Wrap } from "@chakra-ui/react";
import useRecommendations from "../hooks/useRecommendations";
import { useForm } from "react-hook-form";
import { RecommendationFormFields, RecommendationSchema } from "../../../schemas/recommendationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Sparkles } from "lucide-react";
import RecommendationCarousel from "./recommendationCarousel";
import { useMemo, useRef } from "react";
import { Recommendation } from "../types/recommendationResponse";

export default function RecommendationWidget() {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const { mutate, data, isPending } = useRecommendations()
    const { register, handleSubmit, formState, setValue } = useForm<RecommendationFormFields>({
        defaultValues: {
            prompt: ""
        },
        resolver: zodResolver(RecommendationSchema)
    })

    const { ref: registerRef, ...registerRest } = register("prompt")

    const handlePresetClick = (prompt: string) => {
        setValue("prompt", prompt, { shouldDirty: true })
        handleSubmit((fields) => mutate(fields.prompt))()
    }

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
            {(data || isPending) && <RecommendationCarousel data={recommendations} isLoading={isPending}/>}


            <Box w={"full"} paddingX={{ base: '1.25rem', md: '4rem' }} >
                <form onSubmit={handleSubmit((fields) => mutate(fields.prompt))}>
                    <Box w={"full"} borderWidth={1} rounded={"lg"} onClick={() => textAreaRef.current?.focus()}>
                        <Textarea
                            {...registerRest}
                            ref={(e) => {
                                registerRef(e)
                                // @ts-expect-error-setting_the_text_area_ref
                                textAreaRef.current = e
                            }}
                            placeholder="What type of show do you want to watch?"
                            resize={"none"}
                            autoresize
                            rows={1}
                            border={"none"}
                            focusRing={"none"}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // stop newline
                                    handleSubmit((fields) => mutate(fields.prompt))()
                                }
                            }}
                        />
                        <Flex justify={"space-between"} p={4}>
                            <Wrap gap={1} >
                                <Button size={"xs"} rounded={"sm"} disabled={isPending} onClick={() => handlePresetClick("Something wholesome and relaxing")}>Something wholesome and relaxing</Button>
                                <Button size={"xs"} rounded={"sm"} disabled={isPending} onClick={() => handlePresetClick("Dark and psychological")}>Dark and psychological</Button>
                                <Button size={"xs"} rounded={"sm"} disabled={isPending} onClick={() => handlePresetClick("Epic action with great animation")}>Epic action with great animation</Button>
                                <Button size={"xs"} rounded={"sm"} disabled={isPending} onClick={() => handlePresetClick("Emotional slice of life")}>Emotional slice of life</Button>
                            </Wrap>

                            <IconButton type="submit" loading={isPending} disabled={isPending || !formState.isDirty} size={"xs"} rounded={"sm"} bg={"interactive.primary"} color={"text"}>
                                <ArrowUp />
                            </IconButton>
                        </Flex>
                    </Box>
                </form>
            </Box>

        </Stack>
    )
}