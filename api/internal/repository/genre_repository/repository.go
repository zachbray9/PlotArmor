package genrerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type GenreRepository interface {
	GetAll(ctx context.Context, tx *gorm.DB) ([]entities.Genre, error)
}

type genreRepository struct {

}

func NewGenreRepository() GenreRepository{
	return &genreRepository{}
}