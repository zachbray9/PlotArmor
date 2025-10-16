package useranimeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/requests"

	"gorm.io/gorm"
)

func (s *UserAnimeService)Update(context context.Context, userId string, animeId uint, patchRequest requests.UserAnimePatchRequest) error {
	err := database.Db.WithContext(context).Transaction(func(tx *gorm.DB) error {
		// Get existing user anime
		userAnime, err := s.userAnimeRepo.GetByUserAndAnime(context, tx, userId, animeId)
		if err != nil {
			return err
		}
		if userAnime == nil {
			return customErrors.ErrNotFound
		}

		// Validate and update rating
		if patchRequest.Rating != nil {
			if *patchRequest.Rating < 1 || *patchRequest.Rating > 10 {
				return customErrors.ErrInvalidField
			}
			userAnime.Rating = patchRequest.Rating
		}

		// Validate and update watch status
		if patchRequest.WatchStatus != nil {
			allowedWatchStatuses := map[models.WatchStatus]bool{
				models.WatchStatusWatching:      true,
				models.WatchStatusCompleted:     true,
				models.WatchStatusOnHold:       true,
				models.WatchStatusDropped:       true,
				models.WatchStatusPlanToWatch: true,
			}

			if !allowedWatchStatuses[*patchRequest.WatchStatus] {
				return customErrors.ErrInvalidField
			}
			userAnime.WatchStatus = *patchRequest.WatchStatus
		}

		// Validate and update episodes watched
		if patchRequest.NumEpisodesWatched != nil {
			if *patchRequest.NumEpisodesWatched < 0 {
				return customErrors.ErrInvalidField
			}
			userAnime.NumEpisodesWatched = *patchRequest.NumEpisodesWatched
		}

		// Update in repository
		err = s.userAnimeRepo.Update(context, tx, userAnime)
		if err != nil {
			return fmt.Errorf("failed to update user anime: %w", err)
		}

		return nil
	})

	return err
}
