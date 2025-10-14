package animerepository

import (
	"context"
	"fmt"
	"myanimevault/internal/models/entities"
	"time"

	"gorm.io/gorm"
)

func (r *animeRepository) GetFeatured(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error) {
	var animes []entities.Anime

	err := tx.WithContext(ctx).
		Where("status = ?", "RELEASING").
		// Where("average_score IS NOT NULL").
		// Where("average_score > ?", 75.0).
		// Order("average_score DESC, popularity ASC").
		Order("created_at DESC").
		Limit(limit).
		Preload("Studio").
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
		Where("status = ?", "RELEASING").
		// Where("trending IS NOT NULL").
		// Order("trending ASC").
		Order("created_at DESC").
		Limit(limit).
		Preload("Studio").
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
		Preload("Studio").
		Preload("Genres").
		Find(&animes).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get popular animes: %w", err)
	}

	return animes, nil
}

func (r *animeRepository) GetUpcoming(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error) {
	var animes []entities.Anime
	now := time.Now()

	err := tx.WithContext(ctx).
		Where("start_date > ?", now).
		Order("start_date ASC").
		Limit(limit).
		Preload("Studio").
		Preload("Genres").
		Find(&animes).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get upcoming animes: %w", err)
	}

	return animes, nil
}


