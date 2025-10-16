package useranimeservice

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func GetByUserAndAnime(context context.Context, tx *gorm.DB, userId string, animeId uint) (*entities.UserAnime, error) {
	var userAnime entities.UserAnime
    err := tx.WithContext(context).
        Where("user_id = ? AND anime_id = ?", userId, animeId).
        First(&userAnime).Error
    
    if err != nil {
        if err == gorm.ErrRecordNotFound {
            return nil, nil // Return nil, nil when not found (not an error)
        }
        return nil, err
    }
    
    return &userAnime, nil
}
