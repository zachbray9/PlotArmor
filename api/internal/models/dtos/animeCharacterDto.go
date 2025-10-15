package dtos

import (
	"github.com/google/uuid"
)

type AnimeCharacterDto struct {
	Id         uuid.UUID      `json:"id"`
	Role       string         `json:"role"`
	Character  CharacterDto   `json:"character,omitempty"`
	VoiceActor *VoiceActorDto `json:"voice_actor,omitempty"`
}
