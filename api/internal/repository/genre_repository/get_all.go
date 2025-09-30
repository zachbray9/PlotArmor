package genrerepository

import (
	"context"
	"fmt"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *genreRepository) GetAll(ctx context.Context, tx *gorm.DB) ([]entities.Genre, error) {
	var genres []entities.Genre
	err := tx.WithContext(ctx).Find(&genres).Error

	if err != nil {
		return nil, fmt.Errorf("failed to fetch genres from db: %s", err)
	}

	return genres, nil
}