package authservice

import (
	userrepository "myanimevault/internal/repository/user_repository"
	sessionservice "myanimevault/internal/services/session_service"
	userservice "myanimevault/internal/services/user_service"
)

type AuthService struct {
	userService *userservice.UserService
	sessionService *sessionservice.SessionService
	userRepo userrepository.UserRepository
}

func NewAuthService(userService userservice.UserService, sessionService sessionservice.SessionService, userRepo userrepository.UserRepository) *AuthService {
	return &AuthService{
		userService: &userService,
		sessionService: &sessionService,
		userRepo: userRepo,
	}
}