package studiohandler

import studioservice "myanimevault/internal/services/studio_service"

type StudioHandler struct {
	StudioService *studioservice.StudioService
}

func NewStudioHandler(studioService *studioservice.StudioService) *StudioHandler {
	return &StudioHandler{
		StudioService: studioService,
	}
}