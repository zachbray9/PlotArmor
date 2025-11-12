package userservice

import (
	"context"
	"errors"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/utils"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *UserService) Create(ctx context.Context, email string, password string) (*entities.User, error) {
	return s.CreateWithTx(ctx, nil, email, password)
}

// New method that accepts transaction
func (s *UserService) CreateWithTx(ctx context.Context, tx *gorm.DB, email string, password string) (*entities.User, error) {
	db := tx
	if db == nil {
		// If no transaction provided, create one
		var user *entities.User
		err := database.Db.Transaction(func(tx *gorm.DB) error {
			var err error
			user, err = s.createUser(ctx, tx, email, password)
			return err
		})
		return user, err
	}

	// Use provided transaction
	return s.createUser(ctx, db, email, password)
}

// Extracted logic (no transaction handling)
func (s *UserService) createUser(ctx context.Context, db *gorm.DB, email string, password string) (*entities.User, error) {
	existingUser, err := s.userRepo.GetByEmail(ctx, db, email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("failed to check existing user: %w", err)
	}
	if existingUser != nil {
		return nil, customErrors.ErrEmailAlreadyExists
	}

	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	newUser := entities.User{
		Id:           uuid.New(),
		Email:        strings.ToLower(strings.TrimSpace(email)),
		PasswordHash: &hashedPassword,
		Role:         "user",
	}

	err = s.userRepo.Create(ctx, db, &newUser)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &newUser, nil
}
