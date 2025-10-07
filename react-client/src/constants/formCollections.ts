import { createListCollection } from "@chakra-ui/react";

export const formatCollection = createListCollection({
    items: [
        { label: "TV", value: "TV" },
        { label: "Movie", value: "MOVIE" },
        { label: "OVA", value: "OVA" },
        { label: "ONA", value: "ONA" },
        { label: "Special", value: "SPECIAL" },
        { label: "Music", value: "MUSIC" }
    ]
})

export const seasonCollection = createListCollection({
    items: [
        { label: "Fall", value: "FALL" },
        { label: "Winter", value: "WINTER" },
        { label: "Spring", value: "SPRING" },
        { label: "Summer", value: "SUMMER" }
    ]
})

export const ageRatingCollection = createListCollection({
    items: [
        { label: "G", value: "G" },
        { label: "PG", value: "PG" },
        { label: "PG-13", value: "PG-13" },
        { label: "TV-14", value: "TV-14" },
        { label: "TV-MA", value: "TV-MA" },
        { label: "R", value: "R" },
    ]
})