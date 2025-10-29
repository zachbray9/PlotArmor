package animeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/dtos"

	"gorm.io/gorm"
)

type HomePageData struct {
	Featured  []dtos.AnimeDto `json:"featured"`
	TopAiring []dtos.AnimeDto `json:"topAiring"`
	Popular   []dtos.AnimeDto `json:"popular"`
	Upcoming  []dtos.AnimeDto `json:"upcoming"`
}

func (s *AnimeService) GetHomePageData(ctx context.Context) (*HomePageData, error) {
	homePageData := HomePageData{}

	err := database.Db.WithContext(ctx).Transaction(func (tx *gorm.DB) error {
		//get featured shows
		featured, err := s.animeRepo.GetFeatured(ctx, tx, 5)
		if err != nil {
			return fmt.Errorf("failed to get featured shows: %w", err)
		}

		featuredDTOs := make([]dtos.AnimeDto, len(featured))
        for i, anime := range featured {
            posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + ".jpg")
			smallPosterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + "-small.jpg")
            bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)
            featuredDTOs[i] = dtos.ToAnimeDTO(&anime, posterUrl, smallPosterUrl, bannerUrl)
        }

		//get top airing shows
		topAiring, err := s.animeRepo.GetTopAiring(ctx, tx, 20)
		if err != nil {
			return fmt.Errorf("failed to get top airing shows: %w", err)
		}

		topAiringDTOs := make([]dtos.AnimeDto, len(topAiring))
        for i, anime := range topAiring {
            posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + ".jpg")
			smallPosterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + "-small.jpg")
            bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)
            topAiringDTOs[i] = dtos.ToAnimeDTO(&anime, posterUrl, smallPosterUrl, bannerUrl)
        }

		//get popular shows
		popular, err := s.animeRepo.GetPopular(ctx, tx, 20)
		if err != nil {
			return fmt.Errorf("failed to get popular shows: %w", err)
		}

		popularDTOs := make([]dtos.AnimeDto, len(popular))
        for i, anime := range popular {
            posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + ".jpg")
			smallPosterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + "-small.jpg")
            bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)
            popularDTOs[i] = dtos.ToAnimeDTO(&anime, posterUrl, smallPosterUrl, bannerUrl)
        }

		//get upcoming shows
		upcoming, err := s.animeRepo.GetUpcoming(ctx, tx, 20)
		if err != nil {
			return fmt.Errorf("failed to get upcoming shows: %w", err)
		}

		upcomingDTOs := make([]dtos.AnimeDto, len(upcoming))
        for i, anime := range upcoming {
            posterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + ".jpg")
			smallPosterUrl := s.imageService.GetPublicUrl(anime.PosterS3Key + "-small.jpg")
            bannerUrl := s.imageService.GetPublicUrl(anime.BannerS3Key)
            upcomingDTOs[i] = dtos.ToAnimeDTO(&anime, posterUrl, smallPosterUrl, bannerUrl)
        }

		

		homePageData = HomePageData{
			Featured: featuredDTOs,
			TopAiring: topAiringDTOs,
			Popular: popularDTOs,
			Upcoming: upcomingDTOs,
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to get home page data: %w", err)
	}

	return &homePageData, nil
}
