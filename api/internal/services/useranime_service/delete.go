package useranimeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/customErrors"

	"gorm.io/gorm"
)

func (s *UserAnimeService) Delete(ctx context.Context, userId string, animeId uint) error {

	err := database.Db.Transaction(func(tx *gorm.DB) error {
		//fetch useranime to make sure it exists
		userAnime, err := s.userAnimeRepo.GetByUserAndAnime(ctx, tx, userId, animeId)
		if err != nil {
			switch err {
			case customErrors.ErrNotFound:
				return err
			default:
				return fmt.Errorf("failed to fetch useranime: %w", err)
			}
		}

		//delete user anime
		err = s.userAnimeRepo.Delete(ctx, tx, userId, animeId)
		if err != nil {
			return fmt.Errorf("failed to delete useranime: %w", err)
		}

		//update anime rating aggregates
		if userAnime.Rating > 0 {
			err = s.animeRepo.UpdateRatingAggregates(ctx, tx, animeId, userAnime.Rating, 0)
		}

		if err != nil {
			return fmt.Errorf("failed to update anime rating aggregates: %w", err)
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("failed to delete useranime: %w", err)
	}

	return nil
}
