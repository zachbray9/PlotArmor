package dtos

import "myanimevault/internal/models"

type UserAnimeDto struct {
	AnimeId            uint               `json:"id" binding:"required"`
	Title              Title              `json:"title" binding:"required"`
	CoverImage         CoverImage         `json:"coverImage" binding:"required"`
	Format             string             `json:"format" binding:"required"`
	Season             string             `json:"season" binding:"required"`
	SeasonYear         int                `json:"seasonYear" binding:"required"`
	Episodes           int                `json:"episodes"`
	WatchStatus        models.WatchStatus `json:"watchStatus"`
	Rating             int                `json:"rating"`
	NumEpisodesWatched int                `json:"numEpisodesWatched"`
}
