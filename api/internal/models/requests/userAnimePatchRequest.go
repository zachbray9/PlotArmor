package requests

import "myanimevault/internal/models"

type UserAnimePatchRequest struct {
	Rating             int                `json:"rating"`
	WatchStatus        models.WatchStatus `json:"watchStatus"`
	NumEpisodesWatched int                `json:"numEpisodesWatched"`
}
