package animeservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

type HomePageData struct {
	Featured  []entities.Anime `json:"featured"`
	TopAiring []entities.Anime `json:"topAiring"`
	Popular   []entities.Anime `json:"popular"`
	Upcoming  []entities.Anime `json:"upcoming"`
}

func (s *AnimeService) GetHomePageData(ctx context.Context) (*HomePageData, error) {
	homePageData := HomePageData{}

	err := database.Db.WithContext(ctx).Transaction(func (tx *gorm.DB) error {
		featured, err := s.animeRepo.GetFeatured(ctx, tx, 5)
		if err != nil {
			return fmt.Errorf("failed to get featured shows: %w", err)
		}

		topAiring, err := s.animeRepo.GetTopAiring(ctx, tx, 20)
		if err != nil {
			return fmt.Errorf("failed to get top airing shows: %w", err)
		}

		popular, err := s.animeRepo.GetPopular(ctx, tx, 20)
		if err != nil {
			return fmt.Errorf("failed to get popular shows: %w", err)
		}

		upcoming, err := s.animeRepo.GetUpcoming(ctx, tx, 20)
		if err != nil {
			return fmt.Errorf("failed to get upcoming shows: %w", err)
		}

		homePageData = HomePageData{
			Featured: featured,
			TopAiring: topAiring,
			Popular: popular,
			Upcoming: upcoming,
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to get home page data: %w", err)
	}

	return &homePageData, nil
}
