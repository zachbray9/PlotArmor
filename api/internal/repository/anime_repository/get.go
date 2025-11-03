package animerepository

import (
	"context"
	"fmt"
	"myanimevault/internal/models"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *animeRepository) GetById(ctx context.Context, tx *gorm.DB, animeId uint) (*entities.Anime, error) {
	var anime entities.Anime

	err := tx.WithContext(ctx).
		Preload("Studios").
		Preload("Genres").
		Preload("Characters").
		Where("id = ?", animeId).
		First(&anime).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("anime not found")
		}
		return nil, err
	}

	return &anime, nil
}

func (r *animeRepository) GetFeatured(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error) {
	var animes []entities.Anime

	err := tx.WithContext(ctx).
		Where("status = ?", models.StatusCurrentlyAiring).
		// Where("average_score IS NOT NULL").
		// Where("average_score > ?", 75.0).
		// Order("average_score DESC, popularity ASC").
		Order("created_at DESC").
		Limit(limit).
		Preload("Studios").
		Preload("Genres").
		Find(&animes).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get trending animes: %w", err)
	}

	return animes, nil
}

func (r *animeRepository) GetTopAiring(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error) {
	var animes []entities.Anime

	err := tx.WithContext(ctx).
		Where("status = ?", models.StatusCurrentlyAiring).
		// Where("trending IS NOT NULL").
		// Order("trending ASC").
		Order("created_at DESC").
		Limit(limit).
		Preload("Studios").
		Preload("Genres").
		Find(&animes).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get trending animes: %w", err)
	}

	return animes, nil
}

func (r *animeRepository) GetPopular(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error) {
	var animes []entities.Anime

	err := tx.WithContext(ctx).
		// Where("popularity IS NOT NULL").
		// Order("trending ASC").
		Order("favorites DESC, created_at DESC").
		Limit(limit).
		Preload("Studios").
		Preload("Genres").
		Find(&animes).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get popular animes: %w", err)
	}

	return animes, nil
}

func (r *animeRepository) GetUpcoming(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error) {
	var animes []entities.Anime

	err := tx.WithContext(ctx).
		Where("status = ?", models.StatusNotYetReleased).
		Order("start_date ASC").
		Limit(limit).
		Preload("Studios").
		Preload("Genres").
		Find(&animes).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get upcoming animes: %w", err)
	}

	return animes, nil
}

func (r *animeRepository) GetByGenre(ctx context.Context, tx *gorm.DB, genreId uint, page int, limit int) ([]entities.Anime, int64, error) {
	var animes []entities.Anime
	var total int64

	offset := (page - 1) * limit

	// Join with anime_genres table
	baseQuery := tx.Model(&entities.Anime{}).
		Joins("JOIN anime_genres ON anime_genres.anime_id = animes.id").
		Where("anime_genres.genre_id = ?", genreId)

	// Get total count
	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get results ordered by title (since we don't have scores yet)
	if err := baseQuery.
		Order("english_title ASC").
		Limit(limit).
		Offset(offset).
		Find(&animes).Error; err != nil {
		return nil, 0, err
	}

	return animes, total, nil
}