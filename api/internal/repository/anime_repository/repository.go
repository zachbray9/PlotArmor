package animerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type AnimeRepository interface {
	GetById(ctx context.Context, tx *gorm.DB, animeId uint) (*entities.Anime, error)
	GetFeatured(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error)
	GetTopAiring(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error)
	GetPopular(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error)
	GetUpcoming(ctx context.Context, tx *gorm.DB, limit int) ([]entities.Anime, error)
	Create(ctx context.Context, tx *gorm.DB, anime *entities.Anime) error
	Search(ctx context.Context, tx *gorm.DB, query string, page int, limit int, sort string) ([]entities.Anime, int64, error)
}

type animeRepository struct {
}

func NewAnimeRepository() AnimeRepository {
	return &animeRepository{}
}
