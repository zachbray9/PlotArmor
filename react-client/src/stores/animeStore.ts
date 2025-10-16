import { makeAutoObservable } from "mobx"
import { aniListAgent } from "../api/aniListAgent"
import { AniListAnime } from "../models/aniListAnime"
import { CategoryQuery } from "../api/queries/categoryQuery"
import Anime from "../models/anime"

export default class AnimeStore {
    selectedAnime: Anime | null = null
    isLoadingSelectedAnime: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    loadAnimeCategory = async (genre: string | undefined, sortBy: string): Promise<AniListAnime[]> => {
        const query = CategoryQuery(genre, sortBy)

        try {
            const response = await aniListAgent.AnimeData.getCategory(query)
            return response.data.Page.media
        } catch (error) {
            console.log(error)
            return []
        }
    }
}
