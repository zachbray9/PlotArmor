package sessionrepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *sessionRepository) DeleteByUserAndDevice(ctx context.Context, db *gorm.DB, userId uuid.UUID, deviceId string) error {
	return db.WithContext(ctx).
		Where("user_id = ? AND device_id = ?", userId, deviceId).
		Delete(&entities.Session{}).Error
}