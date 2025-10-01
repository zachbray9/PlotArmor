package studiorepository

import (
	"context"
	"fmt"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *studioRepository) GetAll(ctx context.Context, tx *gorm.DB) ([]entities.Studio, error) {
	var studios []entities.Studio

	err := tx.WithContext(ctx).Find(&studios).Error
	if err != nil {
		return nil, fmt.Errorf("studio repo failed to fetch studios: %w", err)
	}

	return studios, nil
}