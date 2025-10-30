package animerepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *animeRepository) Search(ctx context.Context, tx *gorm.DB, query string, page int, limit int, sort string) ([]entities.Anime, int64, error) {
	var animes []entities.Anime
	var total int64

	// Calculate offset
	offset := (page - 1) * limit

	// Build base query
	searchQuery := "%" + query + "%"
	baseQuery := tx.Model(&entities.Anime{}).Where(
		"english_title ILIKE ? OR romaji_title ILIKE ?",
		searchQuery, searchQuery,
	)

	// Get total count
	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply sorting - simple relevance: exact matches first, then partial matches by score
	baseQuery = baseQuery.
		Order(gorm.Expr("CASE WHEN LOWER(english_title) = LOWER(?) OR LOWER(romaji_title) = LOWER(?) THEN 0 ELSE 1 END", query, query)).
		Order("favorites DESC")

	// Execute query with pagination
	if err := baseQuery.Limit(limit).Offset(offset).Find(&animes).Error; err != nil {
		return nil, 0, err
	}

	return animes, total, nil
}
