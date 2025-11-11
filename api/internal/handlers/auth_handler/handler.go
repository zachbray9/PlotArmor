package authhandler

import (
	authservice "myanimevault/internal/services/auth_service"

	"golang.org/x/oauth2"
)

type AuthHandler struct {
	authService *authservice.AuthService
	googleConfig *oauth2.Config
}

func NewAuthHandler(authService *authservice.AuthService, googleConfig *oauth2.Config) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		googleConfig: googleConfig,
	}
}