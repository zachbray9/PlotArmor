package animehandler

import (
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *AnimeHandler) GenerateRecommendations(ctx *gin.Context) {
	var req requests.GenerateRecommedationsRequest
	err := ctx.ShouldBindJSON(&req)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Please provide a valid query.",
			Data: nil,
		})

		return
	}

	recommendations, err := h.animeService.GenerateRecommendations(ctx, req.Query)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to generate recommendations. Please try again.",
			Data: nil,
		})
		return
	}

	ctx.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully generated recommendations.",
		Data: recommendations,
	})
}