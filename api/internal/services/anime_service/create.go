package animeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/embedding"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/requests"
	"myanimevault/internal/utils"
	"os"
	"strings"

	"github.com/pgvector/pgvector-go"
	"gorm.io/gorm"
)

func (s *AnimeService) Create(context context.Context, req requests.CreateAnimeRequest) (*entities.Anime, error) {
	anime := entities.Anime{}

	err := database.Db.WithContext(context).Transaction(func(tx *gorm.DB) error {
		err := s.ValidateAnimeData(req)
		if err != nil {
			return fmt.Errorf("invalid create anime request: %w", err)
		}

		// Fetch genres by IDs
		var genres []entities.Genre
		if len(req.Genres) > 0 {
			genres, err = s.genreRepo.GetByIds(context, tx, req.Genres)
			if err != nil {
				return fmt.Errorf("failed to fetch genres: %w", err)
			}

			// Validate all genres were found
			if len(genres) != len(req.Genres) {
				return fmt.Errorf("one or more genre IDs are invalid")
			}
		}

		// Fetch studios by IDs
		var studios []entities.Studio
		if len(req.Studios) > 0 {
			studios, err = s.studioRepo.GetByIds(context, tx, req.Studios)
			if err != nil {
				return fmt.Errorf("failed to fetch studios: %w", err)
			}

			// Validate all genres were found
			if len(studios) != len(req.Studios) {
				return fmt.Errorf("one or more genre IDs are invalid")
			}
		}

		//format text to be vector embedded
		embeddingText := strings.TrimSpace(fmt.Sprintf("%s. %s", req.EnglishTitle, req.Synopsis))

		//create vector embedding for english title and synopsis
		apiKey := os.Getenv("OPENAI_API_KEY")
		vector, err := embedding.GenerateEmbedding(context, apiKey, embeddingText)
		if err != nil {
			return fmt.Errorf("failed to create embedding for english title: %w", err)
		}

		//map CreateAnimeRequest to Anime
		anime.EnglishTitle = req.EnglishTitle
		anime.RomajiTitle = req.RomajiTitle
		anime.Synopsis = req.Synopsis
		anime.Genres = genres
		anime.Studios = studios
		anime.Embedding = pgvector.NewVector(vector)
		anime.Format = req.Format
		anime.Status = utils.CalculateAiringStatus(req.StartDate, req.EndDate)
		anime.Episodes = req.Episodes
		anime.Duration = req.Duration
		//calculate total duration
		var totalDuration *int
		if req.Episodes != nil && req.Duration != nil {
			result := *req.Episodes * *req.Duration
			totalDuration = &result
		}
		anime.TotalDuration = totalDuration
		anime.StartDate = req.StartDate
		anime.EndDate = req.EndDate
		anime.Season = req.Season
		anime.SeasonYear = req.SeasonYear
		anime.PosterS3Key = req.Poster
		anime.BannerS3Key = req.Banner
		anime.TrailerUrl = req.TrailerUrl
		anime.IsAdult = req.IsAdult
		anime.AgeRating = req.AgeRating

		//Add anime to database
		err = s.animeRepo.Create(context, tx, &anime)
		if err != nil {
			return fmt.Errorf("failed to add anime to the database: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("anime service create method failed: %w", err)
	}

	return &anime, nil
}
