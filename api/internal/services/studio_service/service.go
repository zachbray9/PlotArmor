package studioservice

import studiorepository "myanimevault/internal/repository/studio_repository"

type StudioService struct {
	studioRepo studiorepository.StudioRepository
}

func NewStudioService(studioRepo studiorepository.StudioRepository) *StudioService {
	return &StudioService{
		studioRepo: studioRepo,
	}
}