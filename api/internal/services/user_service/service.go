package userservice

import userrepository "myanimevault/internal/repository/user_repository"

type UserService struct {
	userRepo userrepository.UserRepository
}

func NewUserService(userRepo userrepository.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}