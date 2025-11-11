package entities

import (
	"myanimevault/internal/models"
	"time"

	"github.com/google/uuid"
)

type User struct {
	Id           uuid.UUID       `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Email        string          `json:"email" gorm:"unique;not null"`
	PasswordHash *string          `json:"password_hash"`
	GoogleId     *string         `json:"googleId" gorm:"unique"`
	AuthProvider string          `json:"authProvider" gorm:"default:'local'"`
	Role         models.UserRole `json:"role" gorm:"type:varchar(20);default:'user';not null"`
	CreatedAt    time.Time       `json:"created_at"`

	// Relationships
	Sessions   []Session   `json:"sessions,omitempty" gorm:"foreignKey:UserId"`
	UserAnimes []UserAnime `json:"user_animes,omitempty" gorm:"foreignKey:UserId"`
}
