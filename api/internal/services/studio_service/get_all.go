package studioservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (s *StudioService) GetAll(ctx context.Context) ([]entities.Studio, error) {
	var studios []entities.Studio

	err := database.Db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		res, err := s.studioRepo.GetAll(ctx, tx)

		if err != nil {
			return fmt.Errorf("studio service failed to retrieve studios: %w", err)
		}

		studios = res
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("studio service failed to retrieve studios: %w", err)
	}

	return studios, nil
}