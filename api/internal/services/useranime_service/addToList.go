package useranimeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models"

	"myanimevault/internal/models/entities"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *UserAnimeService) AddToList(context context.Context, userId uuid.UUID, animeId uint) (*entities.UserAnime, error) {
	var userAnime *entities.UserAnime

	err := database.Db.WithContext(context).Transaction(func(tx *gorm.DB) error {
		// Check if anime exists
		_, err := s.animeRepo.GetById(context, tx, animeId)
		if err != nil {
			return fmt.Errorf("anime not found: %w", err)
		}

		// Check if already in list
		existingUserAnime, _ := s.userAnimeRepo.GetByUserAndAnime(context, tx, userId.String(), animeId)
		if existingUserAnime != nil {
			return fmt.Errorf("anime already in your list")
		}

		// Create user anime entry
		userAnime = &entities.UserAnime{
			UserId:      userId,
			AnimeId:     animeId,
			WatchStatus: models.WatchStatusPlanToWatch, // Default status
		}

		err = s.userAnimeRepo.Create(context, tx, userAnime)
		if err != nil {
			return fmt.Errorf("failed to add anime to list: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return userAnime, nil
}
