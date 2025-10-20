package entities

import (
	"myanimevault/internal/models"

	"github.com/google/uuid"
)

type UserAnime struct {
	Id                 uuid.UUID          `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserId             uuid.UUID          `json:"user_id" gorm:"type:uuid;not null"`
	AnimeId            uint               `json:"anime_id" gorm:"not null"`
	WatchStatus        models.WatchStatus `json:"watch_status" gorm:"not null;default:'PLAN_TO_WATCH'"`
	Rating             *int               `json:"rating,omitempty" gorm:"check:rating >= 0 AND rating <= 10;default:0"`
	NumEpisodesWatched int                `json:"num_episodes_watched,omitempty" gorm:"default:0"`

	//relationships
	User  User  `json:"user,omitempty" gorm:"foreignKey:UserId"`
	Anime Anime `json:"anime,omitempty" gorm:"foreignKey:AnimeId"`
}
