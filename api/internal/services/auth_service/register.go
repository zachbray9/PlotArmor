package authservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/utils/cookieutil"
	"net/http"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *AuthService) Register(ctx context.Context, email string, password string) (*dtos.UserDto, *http.Cookie, *http.Cookie, error) {
    var user *entities.User
    var session *entities.Session
    deviceId := uuid.NewString()

    // Single transaction wrapping both operations
    err := database.Db.Transaction(func(tx *gorm.DB) error {
        var err error
        
        // Create user within transaction
        user, err = s.userService.CreateWithTx(ctx, tx, email, password)
        if err != nil {
            return err
        }

        // Create session within same transaction
        session, err = s.sessionService.CreateWithTx(ctx, tx, user.Id, deviceId, 24*time.Hour*30)
        if err != nil {
            return err
        }

        return nil
    })

    if err != nil {
        return nil, nil, nil, fmt.Errorf("registration failed: %w", err)
    }

    userDto := dtos.UserDto{
        Id:    user.Id.String(),
        Email: user.Email,
        Role:  user.Role,
    }

    sessionIdCookie := cookieutil.CreateSessionCookie(session.Id.String())
    deviceIdCookie := cookieutil.CreateDeviceCookie(deviceId)

    return &userDto, sessionIdCookie, deviceIdCookie, nil
}