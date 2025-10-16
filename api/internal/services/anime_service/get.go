package animeservice

import (
	"context"
	"myanimevault/internal/database"
	"myanimevault/internal/models/dtos"

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
		posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key)
		bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)

		// Convert to DTO
		dto := dtos.ToAnimeDTO(anime, posterUrl, bannerUrl)
		animeDto = &dto

		return nil
	})

	if err != nil {
		return nil, err
	}

	return animeDto, nil
}