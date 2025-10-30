package dtos

import "time"

type VoiceActorDto struct {
	Id        uint       `json:"id"`
	Name      string     `json:"name"`
	Language  string     `json:"language"` // e.g., "Japanese", "English"
	ImageUrl  string     `json:"imageUrl,omitempty"`
	BirthDate *time.Time `json:"birthDate,omitempty"`
}
