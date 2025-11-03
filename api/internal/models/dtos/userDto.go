package dtos

import "myanimevault/internal/models"

type UserDto struct {
	Id       string          `json:"id"`
	Email    string          `json:"email"`
	Role     models.UserRole `json:"role"`
}
