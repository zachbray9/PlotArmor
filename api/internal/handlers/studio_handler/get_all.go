package studiohandler

import (
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *StudioHandler) GetAll(context *gin.Context) {
	studios, err := h.StudioService.GetAll(context)

	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to retrieve studios",
			Data: nil,
		})
		return
	}

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully retrieved studios",
		Data: studios,
	})
}
