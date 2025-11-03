package authhandler

import (
	"errors"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *AuthHandler) LoginHandler(context *gin.Context) {
	var loginRequest requests.LoginRequest
	err := context.ShouldBindJSON(&loginRequest)

	if err != nil {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Please provide a valid email and password.",
			Data:    nil,
		})
		return
	}

	// Check for existing device ID
	deviceId, err := context.Cookie("did")
	if err != nil || deviceId == "" {
		deviceId = "" // Auth service will generate new one
	}

	//validate that the user exists and the password is correct
	userDto, sessionIdCookie, deviceIdCookie, err := h.authService.Login(context.Request.Context(), loginRequest.Email, loginRequest.Password, deviceId)

	if err != nil {
		if errors.Is(err, customErrors.ErrNotFound) || errors.Is(err, customErrors.ErrIncorrectPassword) {
			context.JSON(http.StatusUnauthorized, responses.ApiResponse{
				Success: false,
				Message: "Incorrect email or password.",
				Data:    nil,
			})
		} else {
			context.JSON(http.StatusInternalServerError, responses.ApiResponse{
				Success: false,
				Message: "Something went wrong. Please try again later.",
				Data:    nil,
			})
		}

		return
	}

	//add cookies to response
	http.SetCookie(context.Writer, sessionIdCookie)
	http.SetCookie(context.Writer, deviceIdCookie)

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully logged in.",
		Data:    userDto,
	})
}
