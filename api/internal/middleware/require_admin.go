package middleware

import (
	"myanimevault/internal/models"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequireAuth(context *gin.Context) {
	userInterface, exists := context.Get("user")
	if !exists {
		context.JSON(http.StatusUnauthorized, responses.ApiResponse{
			Success: false, 
			Message: "User not authenticated.",
			Data: nil,
		})
		context.Abort()
		return
	}

	user, ok := userInterface.(entities.User)
	if !ok {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false, 
			Message: "Invalid user type.",
			Data: nil,
		})
		context.Abort()
		return
	}

	if user.Role != models.RoleAdmin {
		context.JSON(http.StatusForbidden, responses.ApiResponse{
			Success: false, 
			Message: "Admin access required.",
			Data: nil,
		})
		context.Abort()
		return
	}

	context.Next()
}
