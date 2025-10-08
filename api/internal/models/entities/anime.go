package entities

import (
	"time"

	"github.com/pgvector/pgvector-go"
)

type Anime struct {
	Id uint `json:"id" gorm:"primaryKey"`

	//titles
	EnglishTitle string `json:"english_title"`
	EnglishTitleEmbedding pgvector.Vector `gorm:"type:vector(1536)"`
	RomajiTitle  string `json:"romaji_title"`

	//content info
	Synopsis string `json:"synopsis,omitempty"`
	SynopsisEmbedding pgvector.Vector `gorm:"type:vector(1536)"`
	Format   string `json:"format,omitempty"` //TV, Movie, OVA, etc.
	Status   string `json:"status" gorm:"not null;default:'unknown'"`

	//episode info
	Episodes      *int `json:"episodes,omitempty"`       // Total episodes (null for unknown)
	Duration      *int `json:"duration,omitempty"`       // Episode duration in minutes
	TotalDuration *int `json:"total_duration,omitempty"` // Total runtime in minutes

	//dates
	StartDate  *time.Time `json:"start_date,omitempty"`
	EndDate    *time.Time `json:"end_date,omitempty"`
	Season     string     `json:"season,omitempty"` // WINTER, SPRING, SUMMER, FALL
	SeasonYear *int       `json:"season_year,omitempty"`

	//media urls
	PosterS3Key  string `json:"poster_s3_key,omitempty"`
	BannerS3Key  string `json:"banner_s3_key,omitempty"`
	TrailerUrl string `json:"trailer_url,omitempty"`

	//ratings and popularity
	AverageScore *float64 `json:"average_score,omitempty" gorm:"check:average_score >= 0 AND average_score <= 100"`
	MeanScore    *float64 `json:"mean_score,omitempty" gorm:"check:mean_score >= 0 AND mean_score <= 10"`
	Popularity   *int     `json:"popularity,omitempty"`       // Popularity rank
	Trending     *int     `json:"trending,omitempty"`         // Trending rank
	Favorites    int      `json:"favorites" gorm:"default:0"` // Number of users who favorited

	// Content Ratings
	IsAdult        bool   `json:"is_adult" gorm:"default:false"`
	AgeRating      string `json:"age_rating,omitempty"`       // G, PG, PG-13, R, etc.

	//metadata
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`

	//studio relationship
	StudioId *uint `json:"studio_id,omitempty" gorm:"default:null"`

	// Relationships
	Studio     *Studio          `json:"studio,omitempty" gorm:"foreignKey:StudioId"`
	Genres     []Genre          `json:"genres,omitempty" gorm:"many2many:anime_genres;"`
	Characters []AnimeCharacter `json:"characters,omitempty" gorm:"foreignKey:AnimeId"`
	UserAnimes []UserAnime      `json:"user_animes,omitempty" gorm:"foreignKey:AnimeId"`
}
