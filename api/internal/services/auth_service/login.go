package authservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/utils"
	"myanimevault/internal/utils/cookieutil"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *AuthService) Login(ctx context.Context, email string, password string, deviceId string) (*dtos.UserDto, *http.Cookie, *http.Cookie, error) {
	user, err := s.userRepo.GetByEmail(ctx, database.Db, strings.ToLower(strings.TrimSpace(email)))

	if err != nil {
		return nil, nil, nil, err
	}

	if user.AuthProvider != models.AuthProviderLocal || !user.CanLoginWithPassword(){
		return nil, nil, nil, customErrors.ErrNoPassword
	}

	passwordIsValid := utils.ComparePasswordWithHash(password, *user.PasswordHash)
	if !passwordIsValid {
		return nil, nil, nil, customErrors.ErrIncorrectPassword
	}

	// Track if device ID existed
    hasExistingDevice := deviceId != ""
    if !hasExistingDevice {
        deviceId = uuid.NewString()
    }

	var session *entities.Session

	// Transaction for delete + create session
	err = database.Db.Transaction(func(tx *gorm.DB) error {
		// Delete existing sessions for this user/device if the device id exists
		if hasExistingDevice {
			if err := s.sessionService.DeleteByUserAndDeviceWithTx(ctx, tx, user.Id, deviceId); err != nil {
				return fmt.Errorf("failed to delete existing sessions: %w", err)
			}
		}

		// Create new session
		var err error
		session, err = s.sessionService.CreateWithTx(ctx, tx, user.Id, deviceId, 24*time.Hour*30)
		if err != nil {
			return fmt.Errorf("failed to create session: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, nil, nil, err
	}

	// Build response
	userDto := &dtos.UserDto{
		Id:    user.Id.String(),
		Email: user.Email,
		Role:  user.Role,
	}

	sessionCookie := cookieutil.CreateSessionCookie(session.Id.String())
	deviceCookie := cookieutil.CreateDeviceCookie(deviceId)

	return userDto, sessionCookie, deviceCookie, nil
}
