package utils

import "time"

func CalculateAiringStatus(startDate *time.Time, endDate *time.Time) (string) {
	now := time.Now()
    
    // If no start date, we can't determine status - treat as not yet aired
    if startDate == nil {
        return "NOT_YET_AIRED"
    }
    
    // Not yet aired - start date is in the future
    if now.Before(*startDate) {
        return "NOT_YET_AIRED"
    }
    
    // Currently airing - started but no end date or end date is in the future
    if endDate == nil || now.Before(*endDate) {
        return "AIRING"
    }
    
    // Finished - end date has passed
    return "FINISHED"
}