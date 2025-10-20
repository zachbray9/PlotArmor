package useranimeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (s *UserAnimeService) GetList(context context.Context, tx *gorm.DB, userId string) ([]entities.UserAnime, error) {

	userAnimes, err := s.userAnimeRepo.GetByUserId(context, tx, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to get user anime list: %w", err)
	}


	return userAnimes, nil
}
