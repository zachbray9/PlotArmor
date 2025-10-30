package useranimerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type UserAnimeRepository interface {
	GetByUserId(context context.Context, tx *gorm.DB, userId string) ([]entities.UserAnime, error)
	GetByUserAndAnime(context context.Context, tx *gorm.DB, userId string, animeId uint) (*entities.UserAnime, error)
	Create(context context.Context, tx *gorm.DB, userAnime *entities.UserAnime) error
	Update(context context.Context, tx *gorm.DB, userAnime *entities.UserAnime) error
	Delete (ctx context.Context, tx *gorm.DB, userId string, animeId uint) error
}

type userAnimeRepository struct {
}

func NewUserAnimeRepository() UserAnimeRepository {
	return &userAnimeRepository{}
}
