package genrehandler

import (
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *GenreHandler) GetAllGenreHandler(context *gin.Context) {
	genres, err := h.GenreService.GetAll(context)

	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to fetch genres",
			Data:    nil,
		})
		return
	}

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Genres fetched successfully",
		Data:    genres,
	})
}
