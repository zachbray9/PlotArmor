package useranimehandler

import useranimeservice "myanimevault/internal/services/useranime_service"

type UserAnimeHandler struct {
	UserAnimeService *useranimeservice.UserAnimeService
}

func NewUserAnimeHandler(userAnimeService *useranimeservice.UserAnimeService) *UserAnimeHandler {
	return &UserAnimeHandler{
		UserAnimeService: userAnimeService,
	}
}