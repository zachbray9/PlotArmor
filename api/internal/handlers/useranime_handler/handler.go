package useranimehandler

import (
	imageservice "myanimevault/internal/services/image_service"
	useranimeservice "myanimevault/internal/services/useranime_service"
)

type UserAnimeHandler struct {
	UserAnimeService *useranimeservice.UserAnimeService
	imageService *imageservice.ImageService
}

func NewUserAnimeHandler(userAnimeService *useranimeservice.UserAnimeService, imageService *imageservice.ImageService) *UserAnimeHandler {
	return &UserAnimeHandler{
		UserAnimeService: userAnimeService,
		imageService: imageService,
	}
}