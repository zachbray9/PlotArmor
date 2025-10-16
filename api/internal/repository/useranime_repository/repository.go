package useranimerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type UserAnimeRepository interface {
	GetByUserId(context context.Context, tx *gorm.DB, userId string) ([]entities.UserAnime, error)
	GetByUserAndAnime(context context.Context, userId string, animeId uint) (*entities.UserAnime, error)
	Create(context context.Context, tx *gorm.DB, userAnime *entities.UserAnime) error
}

type userAnimeRepository struct {
}

func NewUserAnimeRepository() UserAnimeRepository {
	return &userAnimeRepository{}
}
