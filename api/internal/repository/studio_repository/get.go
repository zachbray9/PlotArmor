package studiorepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *studioRepository) GetByIds(ctx context.Context, tx *gorm.DB, ids []uint) ([]entities.Studio, error) {
	var studios []entities.Studio
	err := tx.WithContext(ctx).Where("id IN ?", ids).Find(&studios).Error
	return studios, err
}