package animeservice

import (
	"context"
	"encoding/json"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/embedding"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/utils"
	openAiAgent "myanimevault/internal/openai"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
)

type AnimeExplanation struct {
	Title  string `json:"title" jsonschema_description:"The title of the anime"`
	Reason string `json:"reason" jsonschema_description:"The reason why the anime is recommended"`
}

type AnimeExplanationsResponse struct {
	Explanations []AnimeExplanation `json:"explanations" jsonschema_description:"List of anime explanations"`
}

type RecommonendationsResponse struct {
	Query string `json:"query"`
	Recommendations []dtos.AnimeRecommendationDto `json:"recommendations"`
	Explanations []AnimeExplanation `json:"explanations"`
}

func (s *AnimeService) GenerateRecommendations(ctx context.Context, query string) (*RecommonendationsResponse, error) {
	if query == "" {
		return nil, fmt.Errorf("query is required")
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	queryEmbedding, err := embedding.GenerateEmbedding(ctx, apiKey, query)

	if err != nil {
		return nil, fmt.Errorf("failed to generate embedding: %w", err)
	}

	results, err := s.animeRepo.SearchSimilar(ctx, database.Db, queryEmbedding, 5)

	if err != nil {
		return nil, fmt.Errorf("failed to search for similar shows: %w", err)
	}

	//form prompt to send to open ai chat completions api
	showsList := ""
	for i, anime := range results {
		showsList += fmt.Sprintf("%d. %s - %s\n\n", i+1, anime.EnglishTitle, anime.Synopsis)
	}
	prompt := fmt.Sprintf(
		`You are an anime recommendation assistant. I have already selected these anime recommendations based on semantic similarity to the user's query. 
	
		User's request: 
		%s
	
		Shows I have selected (YOU MUST USE ONLY THESE SHOWS): 
		%s
	
		Your task: For each of the %d shows listed above, explain in 1-2 sentences why it matches the user's query.
		- You MUST explain all %d shows in the order provided
		- Use the EXACT titles I provided
		- Do NOT suggest different shows
		- Do NOT add any shows that aren't in my list`, 
		query, showsList, len(results), len(results))

	client := openai.NewClient(option.WithAPIKey(apiKey))
	schema := utils.GenerateSchema[AnimeExplanationsResponse]()

	res, err := openAiAgent.GenerateResponse(ctx, client, schema, "anime_explanations", prompt)

	if err != nil {
		return nil, fmt.Errorf("failed to generate ai response for recommendation explanations: %w", err)
	}

	// Parse the response
	var explanations AnimeExplanationsResponse
	if err := json.Unmarshal([]byte(res.OutputText()), &explanations); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	//map recommendations to dtos
	recommendationDtos := make([]dtos.AnimeRecommendationDto, 0, len(results))
	for _, AnimeWithSimilarity := range results {
		posterUrl := s.imageService.GetPublicUrl(AnimeWithSimilarity.Anime.PosterS3Key + ".jpg")
		smallPosterUrl := s.imageService.GetPublicUrl(AnimeWithSimilarity.Anime.PosterS3Key + "-small.jpg")
		bannerUrl := s.imageService.GetPublicUrl(AnimeWithSimilarity.Anime.BannerS3Key)
		animeDto := dtos.ToAnimeDTO(&AnimeWithSimilarity.Anime, posterUrl, smallPosterUrl, bannerUrl)
		temp := dtos.AnimeRecommendationDto{
			Anime: animeDto,
			Similarity: AnimeWithSimilarity.Similarity,
		}
		recommendationDtos = append(recommendationDtos, temp)
	}

	return &RecommonendationsResponse{
		Query: query,
		Recommendations: recommendationDtos,
		Explanations: explanations.Explanations,
	}, nil
}
