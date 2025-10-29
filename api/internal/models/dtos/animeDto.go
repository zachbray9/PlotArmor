package dtos

import (
	"myanimevault/internal/models"
	"myanimevault/internal/models/entities"
	"time"
)

type AnimeDto struct {
	Id uint `json:"id"`

	//titles
	EnglishTitle string `json:"englishTitle"`
	RomajiTitle  string `json:"romajiTitle"`

	//content info
	Synopsis string        `json:"synopsis,omitempty"`
	Format   string        `json:"format,omitempty"` //TV, Movie, OVA, etc.
	Status   models.Status `json:"status"`

	//episode info
	Episodes      *int `json:"episodes,omitempty"`      // Total episodes (null for unknown)
	Duration      *int `json:"duration,omitempty"`      // Episode duration in minutes
	TotalDuration *int `json:"totalDuration,omitempty"` // Total runtime in minutes

	//dates
	StartDate  *time.Time `json:"startDate,omitempty"`
	EndDate    *time.Time `json:"endDate,omitempty"`
	Season     string     `json:"season,omitempty"` // WINTER, SPRING, SUMMER, FALL
	SeasonYear *int       `json:"seasonYear,omitempty"`

	//media urls
	PosterImage      string `json:"posterImage,omitempty"`
	PosterImageSmall string `json:"posterImageSmall,omitempty"`
	BannerImage      string `json:"bannerImage,omitempty"`
	TrailerUrl       string `json:"trailerUrl,omitempty"`

	//ratings and popularity
	AverageScore *float64 `json:"averageScore,omitempty"`
	MeanScore    *float64 `json:"meanScore,omitempty"`
	Popularity   *int     `json:"popularity,omitempty"` // Popularity rank
	Trending     *int     `json:"trending,omitempty"`   // Trending rank
	Favorites    int      `json:"favorites"`            // Number of users who favorited

	// Content Ratings
	IsAdult   bool   `json:"isAdult"`
	AgeRating string `json:"ageRating,omitempty"` // G, PG, PG-13, R, etc.

	// Relationships
	Studio     *StudioDto          `json:"studio,omitempty"`
	Genres     []GenreDto          `json:"genres,omitempty"`
	Characters []AnimeCharacterDto `json:"characters,omitempty"`
}

func ToAnimeDTO(anime *entities.Anime, originalPosterUrl string, smallPosterUrl, bannerUrl string) AnimeDto {
	dto := AnimeDto{
		Id:           anime.Id,
		EnglishTitle: anime.EnglishTitle,
		RomajiTitle:  anime.RomajiTitle,
		Synopsis:     anime.Synopsis,
		Format:       anime.Format,
		Status:       anime.Status,
		Episodes:     anime.Episodes,
		Duration:     anime.Duration,
		StartDate:    anime.StartDate,
		EndDate:      anime.EndDate,
		Season:       anime.Season,
		SeasonYear:   anime.SeasonYear,
		TrailerUrl:   anime.TrailerUrl,
		AverageScore: anime.AverageScore,
		IsAdult:      anime.IsAdult,
		AgeRating:    anime.AgeRating,
		PosterImage:  originalPosterUrl,
		PosterImageSmall: smallPosterUrl,
		BannerImage:  bannerUrl,
	}

	// Map studio if exists
	if anime.Studio != nil {
		dto.Studio = &StudioDto{
			Id:   anime.Studio.Id,
			Name: anime.Studio.Name,
		}
	}

	// Map genres
	if len(anime.Genres) > 0 {
		dto.Genres = make([]GenreDto, len(anime.Genres))
		for i, genre := range anime.Genres {
			dto.Genres[i] = GenreDto{
				Id:          genre.Id,
				Name:        genre.Name,
				Description: genre.Description,
			}
		}
	}

	// Map characters
	if len(anime.Characters) > 0 {
		dto.Characters = make([]AnimeCharacterDto, len(anime.Characters))
		for i, character := range anime.Characters {
			dto.Characters[i] = AnimeCharacterDto{
				Id:   character.Id,
				Role: character.Role,
				Character: CharacterDto{
					Id:          character.CharacterId,
					Name:        character.Character.Name,
					Description: character.Character.Description,
					ImageUrl:    character.Character.ImageUrl,
				},
				VoiceActor: &VoiceActorDto{
					Id:        *character.VoiceActorId,
					Name:      character.VoiceActor.Name,
					Language:  character.VoiceActor.Language,
					ImageUrl:  character.VoiceActor.ImageUrl,
					BirthDate: character.VoiceActor.BirthDate,
				},
			}
		}
	}

	return dto
}
