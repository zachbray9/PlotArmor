package dtos

type CharacterDto struct {
	Id          uint      `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description,omitempty"`
	ImageUrl    string    `json:"imageUrl,omitempty"`
}