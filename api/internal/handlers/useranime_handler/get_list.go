package useranimehandler

import (
	"myanimevault/internal/database"
	"myanimevault/internal/models/dtos"
	"myanimevault/internal/models/entities"
	"myanimevault/internal/models/responses"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (h *UserAnimeHandler) GetUserListHandler(context *gin.Context) {
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

	var animeList []entities.UserAnime

	err := database.Db.WithContext(context.Request.Context()).Transaction(func(tx *gorm.DB) error {
		var err error
		animeList, err = h.UserAnimeService.GetList(context.Request.Context(), tx, user.Id.String())
		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to retrieve user anime list.",
			Data:    nil,
		})
		return
	}

	//convert to dtos
	userAnimeDtos := make([]dtos.UserAnimeDto, 0, len(animeList))

	for _, userAnime := range animeList {
		posterURL := h.imageService.GetPublicUrl(userAnime.Anime.PosterS3Key)
		bannerURL := h.imageService.GetPublicUrl(userAnime.Anime.BannerS3Key)
		dto := dtos.ToUserAnimeDTO(&userAnime, posterURL, bannerURL)
		userAnimeDtos = append(userAnimeDtos, dto)
	}

	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully retrieved user anime list.",
		Data:    userAnimeDtos,
	})
}
