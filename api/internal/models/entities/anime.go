package entities

import (
	"myanimevault/internal/models"
	"time"

	"github.com/pgvector/pgvector-go"
)

type Anime struct {
	Id uint `json:"id" gorm:"primaryKey"`

	//titles
	EnglishTitle string `json:"english_title"`
	RomajiTitle  string `json:"romaji_title"`

	//content info
	Synopsis string        `json:"synopsis,omitempty"`
	Format   string        `json:"format,omitempty"` //TV, Movie, OVA, etc.
	Status   models.Status `json:"status" gorm:"not null;default:'NOT_YET_RELEASED'"`

	//vector embedding
	Embedding pgvector.Vector `gorm:"type:vector(1536)"`

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
	PosterS3Key string `json:"poster_s3_key,omitempty"`
	BannerS3Key string `json:"banner_s3_key,omitempty"`
	TrailerUrl  string `json:"trailer_url,omitempty"`

	//ratings and popularity
	RatingSum   int `json:"ratingSum" gorm:"default:0"`
	RatingCount int `json:"ratingCount" gorm:"default:0"`
	Favorites   int `json:"favorites" gorm:"default:0"`        // Number of users who have it in their list
	Popularity  int `json:"popularity" gorm:"default:0;index"` // Popularity rank
	Trending    int `json:"trending" gorm:"default:0;index"`   // Trending rank

	// Content Ratings
	IsAdult   bool   `json:"is_adult" gorm:"default:false"`
	AgeRating string `json:"age_rating,omitempty"` // G, PG, PG-13, R, etc.

	//metadata
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`

	// Relationships
	Studios    []Studio         `json:"studios,omitempty" gorm:"many2many:anime_studios;"`
	Genres     []Genre          `json:"genres,omitempty" gorm:"many2many:anime_genres;"`
	Characters []AnimeCharacter `json:"characters,omitempty" gorm:"foreignKey:AnimeId"`
	UserAnimes []UserAnime      `json:"user_animes,omitempty" gorm:"foreignKey:AnimeId"`
}

func (a *Anime) AverageScore() float64 {
	if a.RatingCount == 0 {
		return 0
	}
	return float64(a.RatingSum) / float64(a.RatingCount)
}
