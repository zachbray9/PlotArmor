package useranimerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *userAnimeRepository) Update(ctx context.Context, tx *gorm.DB, userAnime *entities.UserAnime) error {
	return tx.WithContext(ctx).Save(userAnime).Error
}