package sessionservice

import (
	"context"
	"myanimevault/internal/database"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *SessionService) DeleteByUserAndDevice(ctx context.Context, userId uuid.UUID, deviceId string) error {
    return s.DeleteByUserAndDeviceWithTx(ctx, nil, userId, deviceId)
}

func (s *SessionService) DeleteByUserAndDeviceWithTx(ctx context.Context, tx *gorm.DB, userId uuid.UUID, deviceId string) error {
    db := tx
    if db == nil {
        db = database.Db
    }

    return s.sessionRepo.DeleteByUserAndDevice(ctx, db, userId, deviceId)
}