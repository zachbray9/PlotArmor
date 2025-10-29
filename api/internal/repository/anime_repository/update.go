package animerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *animeRepository) IncrementFavorites(ctx context.Context, tx *gorm.DB, animeId uint) error {
	return tx.WithContext(ctx).Exec("UPDATE anime SET favorites = favorites + 1 WHERE id = ?", animeId).Error
}

func (r *animeRepository) DecrementFavorites(ctx context.Context, tx *gorm.DB, animeId uint) error {
	return tx.WithContext(ctx).Exec("UPDATE anime SET favorites = favorites - 1 WHERE id = ? AND favorites > 0", animeId).Error
}

func (r *animeRepository) UpdateRatingAggregates(ctx context.Context, tx *gorm.DB, animeId uint, oldRating int, newRating int) error {
	if oldRating == 0 && newRating > 0 {
		// User is rating for the first time
		// Increment count, add new rating to sum
		return tx.WithContext(ctx).Model(&entities.Anime{}).
			Where("id = ?", animeId).
			Updates(map[string]interface{}{
				"rating_sum":   gorm.Expr("rating_sum + ?", newRating),
				"rating_count": gorm.Expr("rating_count + 1"),
			}).Error

	} else if oldRating > 0 && newRating > 0 {
		// User is changing their existing rating
		// Count stays same, but adjust sum (remove old, add new)
		return tx.WithContext(ctx).Model(&entities.Anime{}).
			Where("id = ?", animeId).
			UpdateColumn("rating_sum", gorm.Expr("rating_sum - ? + ?", oldRating, newRating)).Error

	} else if oldRating > 0 && newRating == 0 {
		// User is removing their rating
		// Decrement count, subtract old rating from sum
		return tx.WithContext(ctx).Model(&entities.Anime{}).
			Where("id = ?", animeId).
			Updates(map[string]interface{}{
				"rating_sum":   gorm.Expr("rating_sum - ?", oldRating),
				"rating_count": gorm.Expr("rating_count - 1"),
			}).Error
	}

	return nil
}
