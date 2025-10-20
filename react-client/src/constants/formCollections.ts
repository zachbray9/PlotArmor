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

export const watchStatusCollection = createListCollection({
    items: [
        { label: "Watching", value: "WATCHING" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Plan to watch", value: "PLAN_TO_WATCH" },
        { label: "Dropped", value: "DROPPED" },
        { label: "On hold", value: "ON_HOLD" },
    ]
})

export const ratingCollection = createListCollection({
    items: [
        { label: "(0) Unrated", value: "0" },
        { label: "(1) Appalling", value: "1" },
        { label: "(2) Horrible", value: "2" },
        { label: "(3) Very bad", value: "3" },
        { label: "(4) Bad", value: "4" },
        { label: "(5) Average", value: "5" },
        { label: "(6) Fine", value: "6" },
        { label: "(7) Good", value: "7" },
        { label: "(8) Very good", value: "8" },
        { label: "(9) Great", value: "9" },
        { label: "(10) Masterpiece", value: "10" },
    ]
})