package authhandler

import (
	"myanimevault/internal/models/responses"
	"myanimevault/internal/utils"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

func (h *AuthHandler) GoogleLogin(ctx *gin.Context) {
	state, err := utils.GenerateStateToken()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to generate state token.",
			Data:    nil,
		})
		return
	}

	// Store state token in a short-lived cookie for verification
	ctx.SetCookie(
		"oauth_state",
		state,
		600, // 10 minutes
		"/",
		"",   // domain
		true, // Secure 
		true, // HttpOnly
	)

	url := h.googleConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	ctx.Redirect(http.StatusFound, url) // 302 redirect to Google
}

func (h *AuthHandler) GoogleCallBack(ctx *gin.Context) {
	//Verify state token (CSRF protection)
	stateFromQuery := ctx.Query("state")
	stateFromCookie, err := ctx.Cookie("oauth_state")
	if err != nil || stateFromQuery != stateFromCookie {
		ctx.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Invalid state token",
			Data:    nil,
		})
		return
	}

	//Clear the state cookie
	ctx.SetCookie("oauth_state", "", -1, "/", "", true, true)

	//Handle potential error from Google
	if errMsg := ctx.Query("error"); errMsg != "" {
		ctx.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Something went wrong, please try again.",
			Data:    nil,
		})
		return
	}

	//Exchange authorization code for tokens
	code := ctx.Query("code")
	if code == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No authorization code received"})
		return
	}

	result, err := h.authService.HandleGoogleLoginCallback(ctx.Request.Context(), code, h.googleConfig)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Something went wrong. Please try again.",
			Data: nil,
		})
		return
	}

	//add cookies to response
	http.SetCookie(ctx.Writer, result.SessionIdCookie)
	http.SetCookie(ctx.Writer, result.DeviceIdCookie)

	// Redirect to home page on frontend
	ctx.Redirect(http.StatusFound, os.Getenv("CLIENT_BASE_URL"))
}

