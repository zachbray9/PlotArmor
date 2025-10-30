import { Box, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface Props {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
}

export default function InfiniteScrollTrigger({ onLoadMore, hasMore, isLoading }: Props) {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // When the trigger element comes into view and we have more data
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 } // Trigger when 10% visible
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [onLoadMore, hasMore, isLoading]);

    return (
        <Box ref={observerTarget} py={4}>
            {isLoading && (
                <Center>
                    <Spinner size="lg" />
                </Center>
            )}
        </Box>
    );
}