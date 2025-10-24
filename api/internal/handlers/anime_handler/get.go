package animehandler

import (
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/responses"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h *AnimeHandler) GetById(c *gin.Context) {
	// Parse anime ID from URL
	idStr := c.Param("animeId")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Invalid anime ID.",
			Data:    nil,
		})
		return
	}

	// Get anime
	anime, err := h.animeService.GetById(c.Request.Context(), uint(id))
	if err != nil {
		if err == customErrors.ErrNotFound {
			c.JSON(http.StatusNotFound, responses.ApiResponse{
				Success: false,
				Message: "Anime not found.",
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to retrieve anime.",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Anime retrieved successfully.",
		Data:    anime,
	})
}

func (h *AnimeHandler) GetByGenre(ctx *gin.Context) {
	genreIdStr := ctx.Param("genreId")
	genreId, err := strconv.ParseUint(genreIdStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Invalid genre id.",
			Data: nil,
		})
		return
	}

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))

	response, err := h.animeService.GetByGenre(ctx.Request.Context(), uint(genreId), page, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to get animes by genre.",
			Data: nil,
		})
		return
	}

	ctx.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully retrieved animes by genre.",
		Data: response,
	})
}
