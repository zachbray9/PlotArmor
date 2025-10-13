package useranimehandler

import (
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	useranimeservice "myanimevault/internal/services/useranime_service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UpdateUserAnimeHandler(context *gin.Context) {
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
		context.JSON(http.StatusBadRequest, gin.H{"error": "invalid_anime_id"})
		return
	}

	var patchRequest requests.UserAnimePatchRequest
	err = context.ShouldBindJSON(&patchRequest)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "invalid_field"})
		return
	}

	err = useranimeservice.Update(user.Id.String(), uint(animeId), patchRequest)

	if err != nil {
		switch err {
		case customErrors.ErrInvalidField:
			context.JSON(http.StatusBadRequest, gin.H{"error": "invalid_field"})
			return
		case customErrors.ErrNotFound:
			context.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
			return
		default:
			context.JSON(http.StatusInternalServerError, gin.H{"error": "internal_server_error"})
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"message": "Successfully updated the UserAnime."})
}
