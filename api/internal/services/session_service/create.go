package sessionservice

import (
	"context"
	"fmt"
	"myanimevault/internal/database"
	"myanimevault/internal/models/entities"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *SessionService) Create(ctx context.Context, userId uuid.UUID, deviceId string, duration time.Duration) (*entities.Session, error) {
    return s.CreateWithTx(ctx, nil, userId, deviceId, duration)
}

func (s *SessionService) CreateWithTx(ctx context.Context, tx *gorm.DB, userId uuid.UUID, deviceId string, duration time.Duration) (*entities.Session, error) {
    db := tx
    if db == nil {
        var session *entities.Session
        err := database.Db.Transaction(func(tx *gorm.DB) error {
            var err error
            session, err = s.createSession(ctx, tx, userId, deviceId, duration)
            return err
        })
        return session, err
    }
    
    return s.createSession(ctx, db, userId, deviceId, duration)
}

func (s *SessionService) createSession(ctx context.Context, db *gorm.DB, userId uuid.UUID, deviceId string, duration time.Duration) (*entities.Session, error) {
    expiresAt := time.Now().Add(duration)
    session := entities.Session{
        Id:        uuid.New(),
        UserId:    userId,
        DeviceId:  deviceId,
        ExpiresAt: expiresAt,
    }

    err := s.sessionRepo.Create(ctx, db, &session)
    if err != nil {
        return nil, fmt.Errorf("failed to create session: %w", err)
    }

    return &session, nil
}
