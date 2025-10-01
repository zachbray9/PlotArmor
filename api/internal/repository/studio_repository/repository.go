package studiorepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type StudioRepository interface {
	GetAll(ctx context.Context, tx *gorm.DB) ([]entities.Studio, error)
}

type studioRepository struct {

}

func NewStudioRepository() StudioRepository{
	return &studioRepository{}
}