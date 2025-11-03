package sessionrepository

import (
	"context"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func (r *sessionRepository) Create(ctx context.Context, tx *gorm.DB, session *entities.Session) error {
	return tx.WithContext(ctx).Create(session).Error
}