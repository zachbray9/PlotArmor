package userrepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *userRepository) Update(ctx context.Context, tx *gorm.DB, user *entities.User) error {
	return tx.WithContext(ctx).Save(user).Error
}
