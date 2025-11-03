package sessionrepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SessionRepository interface {
	Create(ctx context.Context, tx *gorm.DB, session *entities.Session) error
	DeleteByUserAndDevice(ctx context.Context, tx *gorm.DB, userId uuid.UUID, deviceId string) error
}

type sessionRepository struct {
}

func NewSessionRepository() SessionRepository {
	return &sessionRepository{}
}