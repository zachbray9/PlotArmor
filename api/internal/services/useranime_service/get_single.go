package useranimeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (s *UserAnimeService)GetByUserAndAnime(context context.Context, tx *gorm.DB, userId string, animeId uint) (*entities.UserAnime, error) {
    userAnime, err := s.userAnimeRepo.GetByUserAndAnime(context, tx, userId, animeId)

    if err != nil {
        switch err {
        case customErrors.ErrNotFound:
            return nil, err
        default:
            return nil, fmt.Errorf("failed to fetch user anime: %w", err)
            
        }
    }
    
    fmt.Printf("Successfully got user anime: %+v\n", userAnime)
    return userAnime, nil
}
