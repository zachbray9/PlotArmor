package animerepository

import (
	"context"
	"fmt"
	"myanimevault/internal/models/entities"

	"github.com/pgvector/pgvector-go"
	"gorm.io/gorm"
)

type AnimeWithSimilarity struct {
	entities.Anime
	Similarity float64
}

func (r *animeRepository) SearchSimilar(ctx context.Context, tx *gorm.DB, queryEmbedding []float32, limit int) ([]AnimeWithSimilarity, error) {
	vector := pgvector.NewVector(queryEmbedding)
	var results []AnimeWithSimilarity

	err := tx.Raw(`
        SELECT *, 1 - (embedding <=> ?::vector) AS similarity
        FROM animes
        ORDER BY embedding <=> ?::vector
        LIMIT ?
    `, vector, vector, limit).Scan(&results).Error
    
    if err != nil {
        return nil, fmt.Errorf("failed to search similar anime: %w", err)
    }

	return results, nil
}