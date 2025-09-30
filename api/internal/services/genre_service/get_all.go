package genreservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (s *GenreService) GetAll(ctx context.Context) ([]entities.Genre, error) {
	var genres []entities.Genre

	err := database.Db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		res, err := s.GenreRepo.GetAll(ctx, tx)

		if err != nil {
			return fmt.Errorf("genre service failed to get genres from db: %w", err)
		}

		genres = res
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("genre service failed to fetch genres: %w", err)
	}

	return genres, nil
}
