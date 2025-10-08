package authhandler

import (
	"log"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/requests"
	"myanimevault/internal/models/responses"
	authservice "myanimevault/internal/services/auth_service"
	sessionservice "myanimevault/internal/services/session_service"
	useranimeservice "myanimevault/internal/services/useranime_service"
	"myanimevault/internal/utils/cookieutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func LoginHandler(context *gin.Context) {
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

	//validate that the user exists and the password is correct
	user, err := authservice.ValidateCredentials(context.Request.Context(), loginRequest.Email, loginRequest.Password)

	if err != nil {
		switch err {
		case customErrors.ErrNotFound:
			context.JSON(http.StatusUnauthorized, responses.ApiResponse{
				Success: false, 
				Message: "Incorrect email or password.",
				Data: nil,
			})
		case customErrors.ErrIncorrectPassword:
			context.JSON(http.StatusUnauthorized, responses.ApiResponse{
				Success: false, 
				Message: "Incorrect email or password.",
				Data: nil,
			})
		default:
			context.JSON(http.StatusInternalServerError, responses.ApiResponse{
				Success: false, 
				Message: "Something went wrong. Please try again later.",
				Data: nil,
			})
		}

		return
	}

	//get the ids of the animes in the users anime list
	animeIdList, err := useranimeservice.GetIdList(user.Id.String())

	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false, 
			Message: "Something went wrong. Please try again later.",
			Data: nil,
		})
		return
	}

	//check if there is a valid device id from othe deviceIdCookie, and if there is, delete any existing sessions with that device id
	deviceId, err := context.Cookie("did")
	isValidDeviceId := err == nil && deviceId != ""

	if !isValidDeviceId {
		deviceId = uuid.NewString()
	}

	if isValidDeviceId {
		err := sessionservice.DeleteByUserAndDevice(context.Request.Context(), user.Id, deviceId)

		if err != nil {
			log.Printf("failed to delete existing sessions: %v", err)
			context.JSON(http.StatusInternalServerError, responses.ApiResponse{
				Success: false, 
				Message: "Something went wrong. Please try again later.",
				Data: nil,
			})
			return
		}

	}

	//create new session
	session, err := sessionservice.Create(context.Request.Context(), user.Id, deviceId, 24*time.Hour*30)
	if err != nil {
		log.Printf("failed to create a session for user %s: %v", user.Id, err)
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false, 
			Message: "Something went wrong. Please try again later.",
			Data: nil,
		})
		return
	}

	//create user dto to return to the client
	userDto := dtos.UserDto{
		Id:       user.Id.String(),
		Email:    user.Email,
		AnimeIds: animeIdList,
	}

	//create session id cookie
	sessionIdCookie := cookieutil.CreateSessionCookie(session.Id.String())

	//create device id cookie
	deviceIdCookie := cookieutil.CreateDeviceCookie(deviceId)

	//add cookies to response
	http.SetCookie(context.Writer, sessionIdCookie)
	http.SetCookie(context.Writer, deviceIdCookie)

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true, 
		Message: "Successfully logged in.",
		Data: userDto,
	})
}
