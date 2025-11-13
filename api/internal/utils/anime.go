package utils

import (
	"myanimevault/internal/models"
	"time"
)

func CalculateAiringStatus(startDate *time.Time, endDate *time.Time, mediaType string) models.Status {
	now := time.Now()

	// Has a start date
	if startDate != nil {
		// Not yet released
		if startDate.After(now) {
			return models.StatusNotYetReleased
		}

		if mediaType == "MOVIE" {
			return models.StatusFinished
		}

		// Currently airing (started but no end date OR end date is in future)
		if endDate == nil || endDate.After(now) {
			return models.StatusCurrentlyAiring
		}

		// Finished airing
		if endDate.Before(now) {
			return models.StatusFinished
		}
	}

	// No start date - assume not yet released
	return models.StatusNotYetReleased
}
