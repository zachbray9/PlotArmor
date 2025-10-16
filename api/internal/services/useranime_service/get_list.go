package useranimeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/models/dtos"

	"gorm.io/gorm"
)

func (s *UserAnimeService) GetList(context context.Context, tx *gorm.DB, userId string) ([]dtos.UserAnimeDto, error) {

	userAnimes, err := s.userAnimeRepo.GetByUserId(context, tx, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to get user anime list: %w", err)
	}

	// Convert to DTOs
	animeList := make([]dtos.UserAnimeDto, 0, len(userAnimes))
	for _, userAnime := range userAnimes {
		dto := dtos.UserAnimeDto{
			AnimeId:            userAnime.AnimeId,
			WatchStatus:        userAnime.WatchStatus,
			Rating:             *userAnime.Rating,
			NumEpisodesWatched: userAnime.NumEpisodesWatched,
		}

		animeList = append(animeList, dto)
	}

	return animeList, nil
}
