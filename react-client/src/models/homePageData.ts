import Anime from "./anime"

export default interface HomePageData {
    data: {
        featured: {
            media: Anime[]
        },
        trending: {
            media: Anime[]
        },
        popular: {
            media: Anime[]
        },
        upcoming: {
            media: Anime[]
        }
    }
}