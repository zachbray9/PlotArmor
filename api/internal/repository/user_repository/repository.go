package userrepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetByEmail(ctx context.Context, tx *gorm.DB, email string) (*entities.User, error)
	GetByGoogleId(ctx context.Context, tx *gorm.DB, googleId string) (*entities.User, error)
	Create(ctx context.Context, tx *gorm.DB, user *entities.User) error
	Update(ctx context.Context, tx *gorm.DB, user *entities.User) error
}

type userRepository struct {
}

func NewUserRepo() UserRepository {
	return &userRepository{}
}
