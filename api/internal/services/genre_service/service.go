package genreservice

import genrerepository "myanimevault/internal/repository/genre_repository"

type GenreService struct {
	GenreRepo genrerepository.GenreRepository
}

func NewGenreService(genreRepo genrerepository.GenreRepository) *GenreService {
	return &GenreService{
		GenreRepo: genreRepo,
	}
}