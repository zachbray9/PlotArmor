package dtos

type AnimeRecommendationDto struct {
	Anime      AnimeDto `json:"anime"`
	Similarity float64  `json:"similarity"`
}
