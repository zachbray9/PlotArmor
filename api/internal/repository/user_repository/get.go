package userrepository

import (
	"context"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *userRepository) GetByEmail(ctx context.Context, tx *gorm.DB, email string) (*entities.User, error) {
	var user entities.User

	err := tx.WithContext(ctx).Where("email = ?", email).First(&user).Error

	if err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			return nil, customErrors.ErrNotFound
		default:
			return nil, err
		}
	}

	return &user, nil
}

func (r *userRepository) GetByGoogleId(ctx context.Context, tx *gorm.DB, googleId string) (*entities.User, error) {
	var user entities.User

	err := tx.WithContext(ctx).Where("google_id = ?", googleId).First(&user).Error

	if err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			return nil, customErrors.ErrNotFound
		default:
			return nil, err
		}
	}

	return &user, nil
}
