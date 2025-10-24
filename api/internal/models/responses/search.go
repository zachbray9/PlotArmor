package responses

import (
	"myanimevault/internal/models/dtos"
)

type SearchResponse struct {
	Results    []dtos.AnimeDto `json:"results"`
	Pagination Pagination      `json:"pagination"`
	Query      string          `json:"query"`
}

type BrowseResponse struct {
	Results    []dtos.AnimeDto `json:"results"`
	Pagination Pagination      `json:"pagination"`
	Genre      dtos.GenreDto   `json:"genre"`
}

type Pagination struct {
	CurrentPage  int  `json:"currentPage"`
	TotalPages   int  `json:"totalPages"`
	TotalResults int  `json:"totalResults"`
	Limit        int  `json:"limit"`
	HasMore      bool `json:"hasMore"`
}
