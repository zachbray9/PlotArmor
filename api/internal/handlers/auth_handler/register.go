package authhandler

import (
	"log"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	sessionservice "myanimevault/internal/services/session_service"
	userservice "myanimevault/internal/services/user_service"
	"myanimevault/internal/utils/cookieutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func RegisterHandler(context *gin.Context) {
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

	user, err := userservice.Create(registerRequest.Email, registerRequest.Password)

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

	//create new device id
	deviceId := uuid.NewString()

	//create session
	session, err := sessionservice.Create(context.Request.Context(), user.Id, deviceId, 24*time.Hour*30)
	if err != nil {
		log.Printf("sessionService.Create: failed to create a session for user %s: %v", user.Id, err)
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Something went wrong. Please try again later.",
			Data:    nil,
		})
		return
	}

	//create session id cookie
	sessionIdCookie := cookieutil.CreateSessionCookie(session.Id.String())

	//create device id cookie
	deviceIdCookie := cookieutil.CreateDeviceCookie(deviceId)

	userDto := dtos.UserDto{
		Id:       user.Id.String(),
		Email:    user.Email,
		AnimeIds: make([]uint, 0),
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
