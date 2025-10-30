package utils

import (
	"myanimevault/internal/models"
	"time"
)

func CalculateAiringStatus(startDate *time.Time, endDate *time.Time) models.Status {
	now := time.Now()

	// Has a start date
	if startDate != nil {
		// Not yet released
		if startDate.After(now) {
			return models.StatusNotYetReleased
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
