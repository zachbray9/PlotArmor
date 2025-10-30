package genrehandler

import genreservice "myanimevault/internal/services/genre_service"

type GenreHandler struct {
	GenreService *genreservice.GenreService
}

func NewGenreHandler(genreService *genreservice.GenreService) *GenreHandler {
	return &GenreHandler{
		GenreService: genreService,
	}
}