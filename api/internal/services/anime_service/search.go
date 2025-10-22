package animeservice

import (
	"context"
	"errors"
	"fmt"
	"math"
	"myanimevault/internal/database"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/responses"

	"gorm.io/gorm"
)

func (s *AnimeService) Search(context context.Context, query string, page int, limit int, sort string) (*responses.SearchResponse, error) {
	// Validate inputs
    if query == "" {
        return nil, errors.New("search query cannot be empty")
    }

    if page < 1 {
        page = 1
    }

    if limit < 1 || limit > 100 {
        limit = 20
    }

    validSorts := map[string]bool{
        "relevance":  true,
        "rating":     true,
        "popularity": true,
        "title":      true,
    }
    if !validSorts[sort] {
        sort = "relevance"
    }

    // Call repository
	var animes []entities.Anime
	var total int64
	
	err := database.Db.WithContext(context).Transaction(func(tx *gorm.DB) error {
		var err error
		animes, total, err = s.animeRepo.Search(context, tx, query, page, limit, sort)
		if err != nil {
			return fmt.Errorf("failed to search anime: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to execute search query: %w", err)
	}

    // Calculate pagination metadata
    totalPages := int(math.Ceil(float64(total) / float64(limit)))

	//transform animes to animeDTOs
	animeDtos := make([]dtos.AnimeDto, 0, len(animes))
	for _, anime := range animes {
		posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key)
		bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)
		animeDto := dtos.ToAnimeDTO(&anime, posterUrl, bannerUrl)
		animeDtos = append(animeDtos, animeDto)
	}

    // Build response
    response := &responses.SearchResponse{
        Results: animeDtos,
        Pagination: responses.Pagination{
            CurrentPage:  page,
            TotalPages:   totalPages,
            TotalResults: int(total),
            Limit:        limit,
            HasMore:      page < totalPages,
        },
        Query: query,
    }

    return response, nil
}