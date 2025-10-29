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

func (s *AnimeService) GetById(ctx context.Context, id uint) (*dtos.AnimeDto, error) {
	var animeDto *dtos.AnimeDto

	err := database.Db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		anime, err := s.animeRepo.GetById(ctx, tx, id)
		if err != nil {
			return err
		}

		// Generate URLs
		posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + ".jpg")
		smallPosterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + "-small.jpg")
		bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)

		// Convert to DTO
		dto := dtos.ToAnimeDTO(anime, posterUrl, smallPosterUrl, bannerUrl)
		animeDto = &dto

		return nil
	})

	if err != nil {
		return nil, err
	}

	return animeDto, nil
}

func (s *AnimeService) GetByGenre(ctx context.Context, genreId uint, page int, limit int) (*responses.BrowseResponse, error) {
	if genreId == 0 {
		return nil, errors.New("genre ID is required")
	}

	if page < 1 {
		page = 1
	}

	if limit < 1 || limit > 100 {
		limit = 20
	}

	var animes []entities.Anime
	var total int64
	var genre *entities.Genre

	err := database.Db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var err error
		animes, total, err = s.animeRepo.GetByGenre(ctx, tx, genreId, page, limit)
		if err != nil {
			return fmt.Errorf("failed to get animes by genre: %w", err)
		}

		genre, err = s.genreRepo.GetById(ctx, tx, genreId)
		return err
	})

	if err != nil {
		return nil, fmt.Errorf("failed to get anime by genre: %w", err)
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	animeDtos := make([]dtos.AnimeDto, 0, len(animes))
	for _, anime := range animes {
		posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + ".jpg")
		smallPosterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + "-small.jpg")
		bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)
		animeDto := dtos.ToAnimeDTO(&anime, posterUrl, smallPosterUrl, bannerUrl)
		animeDtos = append(animeDtos, animeDto)
	}

	return &responses.BrowseResponse{
		Results: animeDtos,
		Pagination: responses.Pagination{
			CurrentPage:  page,
			TotalPages:   totalPages,
			TotalResults: int(total),
			Limit:        limit,
			HasMore:      page < totalPages,
		},
		Genre: dtos.GenreDto{
			Id: genre.Id,
			Name: genre.Name,
			Description: genre.Description,
		},
	}, nil
}