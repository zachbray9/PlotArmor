package userrepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *userRepository) Create(ctx context.Context, tx *gorm.DB, user *entities.User) (error) {
	return tx.WithContext(ctx).Create(user).Error
}