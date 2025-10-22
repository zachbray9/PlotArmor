package animehandler

import animeservice "myanimevault/internal/services/anime_service"

type AnimeHandler struct {
	animeService *animeservice.AnimeService
}

func NewAnimeHandler(animeservice *animeservice.AnimeService) *AnimeHandler {
	return &AnimeHandler{
		animeService: animeservice,
	}
}