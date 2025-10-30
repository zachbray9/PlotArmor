package requests

type AddToListRequest struct {
	AnimeId uint `json:"animeId" binding:"required"`
}