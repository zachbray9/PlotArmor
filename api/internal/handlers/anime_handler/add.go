package animehandler

import (
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *AnimeHandler) AddAnimeHandler(context *gin.Context) {
	var req requests.CreateAnimeRequest
	err := context.ShouldBindJSON(&req)

	if err != nil {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "There was one or more invalid fields in the create anime request",
			Data:    nil,
		})
		return
	}

	anime, err := h.AnimeService.Create(context, req)
	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "There was a problem creating the anime",
			Data: nil,
		})
		return
	}

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully created anime",
		Data: anime,
	})
}
