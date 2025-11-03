package authhandler

import (
	"log"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *AuthHandler) RegisterHandler(context *gin.Context) {
	var registerRequest requests.RegisterRequest
	err := context.ShouldBindJSON(&registerRequest)

	if err != nil {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Please enter a valid username and password.",
			Data:    nil,
		})
		return
	}

	if registerRequest.Password != registerRequest.ConfirmPassword {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Passwords do not match.",
			Data:    false,
		})
		return
	}

	userDto, sessionIdCookie, deviceIdCookie, err := h.authService.Register(context.Request.Context(), registerRequest.Email, registerRequest.Password)

	if err != nil {
		log.Printf("userservice.Create: failed to add the new user to the database: %v", err)

		switch err {
		case customErrors.ErrEmailAlreadyExists:
			context.JSON(http.StatusConflict, responses.ApiResponse{
				Success: false,
				Message: "An account with this email already exists.",
				Data:    nil,
			})
		default:
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
		Message: "Successfully registered.",
		Data:    userDto,
	})
}
