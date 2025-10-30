package animehandler

import (
	"log"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *AnimeHandler) GetHomePageDataHandler(context *gin.Context) {
	homePageData, err := h.animeService.GetHomePageData(context.Request.Context())

	if err != nil {
		log.Printf("Failed to get home page data: %v", err)
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to load home page data.",
			Data: nil,
		})
		return
	}

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully retrieved home page data.",
		Data: homePageData,
	})
}