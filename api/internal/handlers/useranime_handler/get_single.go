package useranimehandler

import (
	"myanimevault/internal/database"
	"myanimevault/internal/models/customErrors"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/responses"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (h *UserAnimeHandler) GetUserAnimeHandler(context *gin.Context) {
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
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "Invalid anime ID.",
			Data:    nil,
		})
		return
	}

	var userAnime *entities.UserAnime

	err = database.Db.WithContext(context.Request.Context()).Transaction(func(tx *gorm.DB) error {
		userAnime, err = h.UserAnimeService.GetByUserAndAnime(context.Request.Context(), tx, user.Id.String(), uint(animeId))
		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		switch err {
		case customErrors.ErrNotFound:
			context.JSON(http.StatusNotFound, responses.ApiResponse{
				Success: false,
				Message: "User anime not found.",
				Data:    nil,
			})
			return
		default:
			context.JSON(http.StatusInternalServerError, responses.ApiResponse{
				Success: false,
				Message: "Failed to retrieve user anime.",
				Data:    nil,
			})
			return
		}
	}

	//convert to dto
	posterUrl := h.imageService.GetPublicUrl(userAnime.Anime.PosterS3Key + ".jpg")
	smallPosterUrl := h.imageService.GetPublicUrl(userAnime.Anime.PosterS3Key + "-small.jpg")
	bannerUrl := h.imageService.GetPublicUrl(userAnime.Anime.BannerS3Key)
	userAnimeDto := dtos.ToUserAnimeDTO(userAnime, posterUrl, smallPosterUrl, bannerUrl)

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully retrieved user anime details.",
		Data:    userAnimeDto,
	})
}
