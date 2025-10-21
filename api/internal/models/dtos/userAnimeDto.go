package dtos

import (
	"myanimevault/internal/models"
	"myanimevault/internal/models/entities"
)

type UserAnimeDto struct {
	Anime              AnimeDto           `json:"anime"`
	WatchStatus        models.WatchStatus `json:"watchStatus"`
	Rating             int                `json:"rating"`
	NumEpisodesWatched int                `json:"numEpisodesWatched"`
}

func ToUserAnimeDTO(userAnime *entities.UserAnime, posterUrl string, bannerUrl string) UserAnimeDto {
	return UserAnimeDto{
		Anime:              ToAnimeDTO(&userAnime.Anime, posterUrl, bannerUrl),
		WatchStatus:        userAnime.WatchStatus,
		Rating:             userAnime.Rating,
		NumEpisodesWatched: userAnime.NumEpisodesWatched,
	}
}
