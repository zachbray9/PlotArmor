package useranimerepository

import (
	"context"
	"fmt"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *userAnimeRepository) GetByUserId(ctx context.Context, tx *gorm.DB, userId string) ([]entities.UserAnime, error) {
	var userAnimes []entities.UserAnime

	err := tx.WithContext(ctx).
		Where("user_id = ?", userId).
		Find(&userAnimes).Error

	if err != nil {
		return nil, fmt.Errorf("could not execute database query: %w", err)
	}

	return userAnimes, nil
}

func (r *userAnimeRepository) GetByUserAndAnime(context context.Context, tx *gorm.DB, userId string, animeId uint) (*entities.UserAnime, error) {
	var userAnime entities.UserAnime
	err := tx.WithContext(context).
		Where("user_id = ? AND anime_id = ?", userId, animeId).
		First(&userAnime).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return &userAnime, err
}
