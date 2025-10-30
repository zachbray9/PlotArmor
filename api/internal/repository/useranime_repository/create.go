package useranimerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *userAnimeRepository) Create(context context.Context, tx *gorm.DB, userAnime *entities.UserAnime) (error) {
	return tx.WithContext(context).Create(userAnime).Error
}