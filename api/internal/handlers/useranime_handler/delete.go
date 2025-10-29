package useranimehandler

import (
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/responses"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h *UserAnimeHandler) DeleteUserAnimeHandler(context *gin.Context) {
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

	animeId, err := strconv.ParseUint(context.Param("animeId"), 10, 64)

	if err != nil {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Invalid anime id.",
			Data: nil,
		})
		return
	}

	err = h.UserAnimeService.Delete(context, user.Id.String(), uint(animeId))

	if err != nil {
		switch err {
		case customErrors.ErrNotFound:
			context.JSON(http.StatusNotFound, responses.ApiResponse{
				Success: false,
				Message: "Anime not found",
				Data: nil,
			})
			return
		default:
			context.JSON(http.StatusInternalServerError, responses.ApiResponse{
				Success: false,
				Message: "Something went wrong. Please try again.",
				Data: nil,
			})
			return
		}
	}

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully deleted anime from your list.",
		Data: nil,
	})
}
