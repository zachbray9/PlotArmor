package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"myanimevault/config"
	"myanimevault/internal/embedding"
	"myanimevault/internal/models"
	"myanimevault/internal/models/entities"
	openAiAgent "myanimevault/internal/openai"
	animerepository "myanimevault/internal/repository/anime_repository"
	"myanimevault/internal/utils"
	"os"
	"time"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"github.com/pgvector/pgvector-go"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	config.InitEnvVariables()
	connectionString := os.Getenv("CONNECTION_STRING_PROD")
	apiKey := os.Getenv("OPENAI_API_KEY")
	ctx := context.Background()

	Db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDb, err := Db.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying sql database: %v", err)
	}

	sqlDb.SetMaxOpenConns(25)
	sqlDb.SetMaxIdleConns(5)

	log.Println("Database connected successfully")

	client := openai.NewClient(option.WithAPIKey(apiKey))

	animeRepo := animerepository.NewAnimeRepository()
	animeList, err := animeRepo.GetAll(ctx, Db)
	if err != nil {
		log.Fatalf("failed to fetch animes from database: %v", err)
	}

	fmt.Printf("Found %d anime. Rebuilding embeddings...\n", len(animeList))

	for _, a := range animeList {
		log.Println("Reembedding " + a.EnglishTitle)

		//generate metadata
		prompt := fmt.Sprintf(
			`Extract structured metadata for the following anime: 
			
			Title: %s
			Synopsis: %s
			Age-Rating: %s
			`,
			a.EnglishTitle, a.Synopsis, a.AgeRating)

		schema := utils.GenerateSchema[models.AnimeMetaData]()

		res, err := openAiAgent.GenerateResponse(ctx, client, schema, "anime_metadata", prompt)

		if err != nil {
			log.Printf("failed to generate ai response for recommendation explanations: %v", err)
		}

		// Parse the response
		var metadata models.AnimeMetaData
		if err := json.Unmarshal([]byte(res.OutputText()), &metadata); err != nil {
			log.Printf("failed to parse response: %v", err)
		}

		//create slice of genre names
		genreNames := make([]string, 0, len(a.Genres))
		for _, g := range a.Genres {
			genreNames = append(genreNames, g.Name)
		}

		//format text to be vector embedded
		embeddingText := embedding.BuildEmbeddingText(a.EnglishTitle, genreNames, metadata.Themes, metadata.Tags, metadata.Demographic, metadata.Tone, metadata.Vibes, metadata.Pacing, metadata.RecommendedAudience, a.Synopsis)

		embedding, err := embedding.GenerateEmbedding(ctx, apiKey, embeddingText)
		if err != nil {
			log.Printf("failed to create embedding for english title: %v", err)
		}

		if err := Db.WithContext(ctx).Model(&entities.Anime{}).Where("id = ?", a.Id).Updates(entities.Anime{
			Embedding:            pgvector.NewVector(embedding),
			Themes:               metadata.Themes,
			Tags:                 metadata.Tags,
			Demographic:          metadata.Demographic,
			Tone:                 metadata.Tone,
			Vibes:                metadata.Vibes,
			Pacing:               metadata.Pacing,
			RecommendedAudience: metadata.RecommendedAudience,
		}).Error; err != nil {
			log.Printf("Failed to update db for %s: %v", a.EnglishTitle, err)
			continue
		}

		// Avoid OpenAI rate limits
		time.Sleep(300 * time.Millisecond)
	}
}
