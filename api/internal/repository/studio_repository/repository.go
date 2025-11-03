package studiorepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type StudioRepository interface {
	ExistsAll(tx *gorm.DB, studioIds []uint) (bool, error)
	GetByIds(ctx context.Context, tx *gorm.DB, ids []uint) ([]entities.Studio, error)
	GetAll(ctx context.Context, tx *gorm.DB) ([]entities.Studio, error)
}

type studioRepository struct {
}

func NewStudioRepository() StudioRepository {
	return &studioRepository{}
}
