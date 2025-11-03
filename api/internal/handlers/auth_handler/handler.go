package authhandler

import authservice "myanimevault/internal/services/auth_service"

type AuthHandler struct {
	authService *authservice.AuthService
}

func NewAuthHandler(authService *authservice.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}