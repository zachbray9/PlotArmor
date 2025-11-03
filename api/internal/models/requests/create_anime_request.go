package requests

import "time"

type CreateAnimeRequest struct {
	//basic required info
	EnglishTitle string `json:"englishTitle" binding:"required"`
	RomajiTitle  string `json:"romajiTitle" binding:"required"`
	Synopsis     string `json:"synopsis" binding:"required"`
	Format       string `json:"format" binding:"required"`

	//episode info
	Episodes *int `json:"episodes,omitempty" binding:"required"`
	Duration *int `json:"duration,omitempty" binding:"required"`

	//season info
	Season     string `json:"season" binding:"required"`
	SeasonYear *int   `json:"seasonYear" binding:"required"`

	//content ratings
	AgeRating string `json:"ageRating" binding:"required"`
	IsAdult   bool   `json:"isAdult"`

	//images
	Poster string `json:"poster" binding:"required"`
	Banner string `json:"banner"`

	//relationships
	Studios []uint `json:"studios" binding:"required,min=1"`
	Genres  []uint `json:"genres" binding:"required,min=1"`

	// Optional additional fields
	TrailerUrl string     `json:"trailerUrl,omitempty"`
	StartDate  *time.Time `json:"startDate,omitempty"`
	EndDate    *time.Time `json:"endDate,omitempty"`
}
