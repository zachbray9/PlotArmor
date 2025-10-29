package useranimerepository

import (
	"context"
	"fmt"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *userAnimeRepository) Delete(ctx context.Context, tx *gorm.DB, userId string, animeId uint) error {
	result := tx.WithContext(ctx).Where("user_id = ? AND anime_id = ?", userId, animeId).Delete(&entities.UserAnime{})

	if result.Error != nil {
		return fmt.Errorf("failed to delete useranime: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return customErrors.ErrNotFound
	}

	return nil
}
