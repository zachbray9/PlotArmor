package authhandler

import (
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *AuthHandler) GetCurrentUserHandler(context *gin.Context) {
	userInterface, exists := context.Get("user")
	if !exists {
		context.JSON(http.StatusUnauthorized, responses.ApiResponse{
			Success: false, 
			Message: "User not authenticated.",
			Data: nil,
		})
		return
	}

	user, ok := userInterface.(entities.User)
	if !ok {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Invalid user type.",
			Data: nil,
		})
		return
	}

	userDto := dtos.UserDto{
		Id: user.Id.String(),
		Email: user.Email,
		Role: user.Role,
	}

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Current user was successfully returned.", 
		Data: userDto,
	})
}
