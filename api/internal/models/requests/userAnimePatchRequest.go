package requests

import "myanimevault/internal/models"

type UserAnimePatchRequest struct {
	Rating             *int                `json:"rating"`
	WatchStatus        *models.WatchStatus `json:"watch_status"`
	NumEpisodesWatched *int                `json:"num_episodes_watched"`
}
