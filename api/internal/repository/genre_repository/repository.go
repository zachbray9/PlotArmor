package genrerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type GenreRepository interface {
	GetByIds(ctx context.Context, tx *gorm.DB, ids []uint) ([]entities.Genre, error)
	GetAll(ctx context.Context, tx *gorm.DB) ([]entities.Genre, error)
}

type genreRepository struct {
}

func NewGenreRepository() GenreRepository {
	return &genreRepository{}
}
