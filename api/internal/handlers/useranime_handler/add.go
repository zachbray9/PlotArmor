package useranimehandler

import (
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *UserAnimeHandler) AddToListHandler(context *gin.Context) {
	//get user from context (auth middleware)
	userInterface, exists := context.Get("user")
	if !exists {
		context.JSON(http.StatusUnauthorized, responses.ApiResponse{
			Success: false,
			Message: "User not authenticated.",
			Data:    nil,
		})
		return
	}

	user, ok := userInterface.(entities.User)
	if !ok {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Invalid user type.",
			Data:    nil,
		})
		return
	}

	// Parse request
	var req requests.AddToListRequest
	if err := context.ShouldBindJSON(&req); err != nil {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Invalid request body",
			Data:    nil,
		})
		return
	}

	// Add to list
	userAnime, err := h.UserAnimeService.AddToList(context.Request.Context(), user.Id, req.AnimeId)
	if err != nil {
		switch err {
		case customErrors.ErrNotFound:
			context.JSON(http.StatusNotFound, responses.ApiResponse{
				Success: false,
				Message: "Anime not found",
				Data:    nil,
			})
			return
		case customErrors.ErrAnimeAlreadyExists:
			context.JSON(http.StatusConflict, responses.ApiResponse{
				Success: false,
				Message: err.Error(),
				Data:    nil,
			})
			return
		default:
			context.JSON(http.StatusInternalServerError, responses.ApiResponse{
				Success: false,
				Message: "Failed to add anime to list",
				Data:    nil,
			})
			return

		}
	}

	context.JSON(http.StatusCreated, responses.ApiResponse{
		Success: true,
		Message: "Anime added to your list successfully",
		Data:    userAnime,
	})
}
