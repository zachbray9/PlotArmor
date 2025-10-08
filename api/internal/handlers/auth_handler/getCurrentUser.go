package authhandler

import (
	"log"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/responses"
	userservice "myanimevault/internal/services/user_service"
	useranimeservice "myanimevault/internal/services/useranime_service"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetCurrentUserHandler(context *gin.Context) {
	userId := context.GetString("userId")
	parsedUserId, err := uuid.Parse(userId)
	if err != nil {
		log.Printf("failed to parse userId from context: %v", err)
		context.JSON(http.StatusUnauthorized, responses.ApiResponse{
			Success: false, 
			Message: "Session invalid or expired.",
			Data: nil,
		})
		return
	}

	user, err := userservice.Get(context.Request.Context(), parsedUserId)

	if err != nil {
		switch err {
		case customErrors.ErrNotFound:
			context.JSON(http.StatusNotFound, responses.ApiResponse{
				Success: false,
				Message: "User not found.",
				Data: nil,
			})
			return
		default:
			context.JSON(http.StatusInternalServerError, responses.ApiResponse{
				Success: false,
				Message: "Something went wrong. Please try again later.",
				Data: nil,
			})
			return
		}
	}

	animeIdList, err := useranimeservice.GetIdList(userId)

	if err != nil {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Something went wrong. Please try again later.",
			Data: nil,
		})
		return
	}

	userDto := dtos.UserDto{}

	userDto.Id = user.Id.String()
	userDto.Email = user.Email
	userDto.AnimeIds = animeIdList

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Current user was successfully returned.", 
		Data: userDto,
	})
}
