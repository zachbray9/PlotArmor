package useranimehandler

import (
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/responses"
	useranimeservice "myanimevault/internal/services/useranime_service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetUserAnimeHandler(context *gin.Context) {
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

	var userAnime dtos.UserAnimeDetailsDto = dtos.UserAnimeDetailsDto{}

	err = useranimeservice.GetUserAnime(user.Id.String(), uint(animeId), &userAnime)

	if err != nil {
		switch err {
		case customErrors.ErrNotFound:
			context.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
			return
		default:
			context.JSON(http.StatusInternalServerError, gin.H{"error": "internal_server_error"})
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"message": "successfully retrieved UserAnime details.", "userAnime": userAnime})
}
