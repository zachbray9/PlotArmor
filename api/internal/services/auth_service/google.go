package authservice

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/utils/cookieutil"
	"net/http"
	"time"

	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

type GoogleCallbackResult struct {
	User            *dtos.UserDto
	SessionIdCookie *http.Cookie
	DeviceIdCookie  *http.Cookie
}

type GoogleUserInfo struct {
	Sub           string `json:"sub"` // Google user ID
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
}

func (s *AuthService) HandleGoogleLoginCallback(ctx context.Context, googleAuthorizationCode string, googleConfig *oauth2.Config) (*GoogleCallbackResult, error) {
	//exchange authorization code for access token
	token, err := googleConfig.Exchange(ctx, googleAuthorizationCode)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code for access token: %w", err)
	}

	googleUserInfo, err := s.GetGoogleUserInfo(token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	//verify email is verified
	if !googleUserInfo.EmailVerified {
		return nil, fmt.Errorf("google email not verified")
	}

	var result GoogleCallbackResult
	err = database.Db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		//find or create user in database
		user, err := s.FindOrCreateUser(ctx, tx, googleUserInfo)
		if err != nil {
			return fmt.Errorf("failed to find or create user: %w", err)
		}
		result.User = user

		//create session
		userId, err := uuid.Parse(user.Id)
		if err != nil {
			return fmt.Errorf("failed to parse user id string into a uuid: %w", err)
		}
		session, err := s.sessionService.CreateWithTx(ctx, tx, userId, "", 24*time.Hour*30)
		if err != nil {
			return fmt.Errorf("failed to create session: %w", err)
		}

		//create session and device id cookies
		sessionIdCookie := cookieutil.CreateSessionCookie(session.Id.String())
		deviceIdCookie := cookieutil.CreateDeviceCookie(session.DeviceId)
		result.SessionIdCookie = sessionIdCookie
		result.DeviceIdCookie = deviceIdCookie

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("transaction failed: %w", err)
	}

	return &result, nil
}

func (s *AuthService) GetGoogleUserInfo(accessToken string) (*GoogleUserInfo, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get user info: status %d", resp.StatusCode)
	}

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}

func (s *AuthService) FindOrCreateUser(ctx context.Context, tx *gorm.DB, googleUserInfo *GoogleUserInfo) (*dtos.UserDto, error) {
	user, err := s.userRepo.GetByGoogleId(ctx, tx, googleUserInfo.Sub)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("failed to find user by google id: %w", err)
	}

	//if user exists, update them
	if user != nil {
		user.Email = googleUserInfo.Email

		if err := s.userRepo.Update(ctx, tx, user); err != nil {
			return nil, fmt.Errorf("error updating user: %w", err)
		}
		return &dtos.UserDto{
			Id:    user.Id.String(),
			Email: user.Email,
			Role:  user.Role,
		}, nil
	}

	// Check if user with this email already exists (different auth method)
	user, err = s.userRepo.GetByEmail(ctx, tx, googleUserInfo.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("error finding user by email: %w", err)
	}

	// If local account exists, block automatic linking (no email verification yet)
	if user != nil {
		// TODO: Change this to automatic linking once email verification is implemented
		return nil, errors.New("account_exists_with_password")
	}

	// Create new user
	newUser := &entities.User{
		Id:       uuid.New(),
		Email:    googleUserInfo.Email,
		GoogleId: &googleUserInfo.Sub,
		Role:     models.RoleUser,
	}

	if err := s.userRepo.Create(ctx, tx, newUser); err != nil {
		return nil, fmt.Errorf("error creating user: %w", err)
	}

	return &dtos.UserDto{
		Id:    newUser.Id.String(),
		Email: newUser.Email,
		Role:  newUser.Role,
	}, nil
}
