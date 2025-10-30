package userservice

import (
	"errors"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/utils"
	"strings"

	"gorm.io/gorm"
)

func Create(email string, password string) (entities.User, error) {
	var newUser entities.User

	// Check if email already exists
	var existingUser entities.User
	if err := database.Db.Where("email = ?", email).First(&existingUser).Error; err == nil {
		return newUser, customErrors.ErrEmailAlreadyExists
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return newUser, fmt.Errorf("failed to check existing user: %w", err)
	}

	// Hash the password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return newUser, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create the user entity
	newUser = entities.User{
		Email:        strings.ToLower(email),
		PasswordHash: hashedPassword,
	}

	// Create using GORM
	err = database.Db.Create(&newUser).Error

	if err != nil {
		return entities.User{}, fmt.Errorf("failed to create user: %w", err)
	}

	return newUser, nil
}
