import { makeAutoObservable } from "mobx";
import { UserAnime } from "../models/userAnime";

export default class ListStore {
    searchQuery: string = ''
    watchStatusFilter: string | null = null
    genresFilter: string[] = []
    sortPreference: string = 'title'

    constructor() {
        makeAutoObservable(this)
    }

    get filteredList() {
        let filteredList: UserAnime[] = this.list

        if(this.searchQuery) filteredList = filteredList.filter(userAnime => userAnime.anime.romajiTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) || userAnime.anime.englishTitle.toLowerCase().includes(this.searchQuery.toLowerCase()))

        if (this.watchStatusFilter) filteredList = filteredList.filter(userAnime => userAnime.watchStatus === this.watchStatusFilter)
        
        let sortedList: UserAnime[] = []
        if (this.sortPreference === 'title') sortedList = filteredList.slice().sort((a, b) => a.anime.romajiTitle.localeCompare(b.anime.romajiTitle))
        if (this.sortPreference === 'rating') sortedList = filteredList.slice().sort((a, b) => b.rating - a.rating)
        if (this.sortPreference === 'progress') sortedList = filteredList.slice().sort((a, b) => b.numEpisodesWatched - a.numEpisodesWatched)

        return sortedList
    }

    setSearchQuery = (query: string) => {
        this.searchQuery = query
    }

    setWatchStatusFilter = (watchStatusFilter: string | null) => {
        this.watchStatusFilter = watchStatusFilter
    }

    setGenresFilter = (genres: string[]) => {
        this.genresFilter = genres
    }

    setSortPreference = (sortPreference: string) => {
        this.sortPreference = sortPreference
    }

    clearList = () => {
        this.list = []
    }

}