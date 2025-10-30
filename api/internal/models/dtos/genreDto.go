package dtos

type GenreDto struct {
	Id          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}
