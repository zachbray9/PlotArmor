package animeservice

import (
	animerepo "myanimevault/internal/repository/anime_repository"
	genrerepository "myanimevault/internal/repository/genre_repository"
	studiorepository "myanimevault/internal/repository/studio_repository"
	imageservice "myanimevault/internal/services/image_service"
)

type AnimeService struct {
	animeRepo animerepo.AnimeRepository
	genreRepo genrerepository.GenreRepository
	studioRepo studiorepository.StudioRepository
	imageService *imageservice.ImageService
}

func NewAnimeService(animeRepo animerepo.AnimeRepository, genreRepo genrerepository.GenreRepository, studioRepo studiorepository.StudioRepository, imageService *imageservice.ImageService) *AnimeService {
	return &AnimeService{
		animeRepo: animeRepo,
		genreRepo: genreRepo,
		studioRepo: studioRepo,
		imageService: imageService,
	}
}