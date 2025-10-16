package useranimeservice

import (
	animerepository "myanimevault/internal/repository/anime_repository"
	useranimerepository "myanimevault/internal/repository/useranime_repository"
)

type UserAnimeService struct {
	userAnimeRepo useranimerepository.UserAnimeRepository
	animeRepo animerepository.AnimeRepository
}

func NewUserAnimeService(userAnimeRepo useranimerepository.UserAnimeRepository, animeRepo animerepository.AnimeRepository) *UserAnimeService {
	return &UserAnimeService{
		userAnimeRepo: userAnimeRepo,
		animeRepo: animeRepo,
	}
}