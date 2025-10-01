package routes

import (
	"fmt"
	animehandler "myanimevault/internal/handlers/anime_handler"
	authhandler "myanimevault/internal/handlers/auth_handler"
	genrehandler "myanimevault/internal/handlers/genre_handler"
	imagehandler "myanimevault/internal/handlers/image_handler"
	studiohandler "myanimevault/internal/handlers/studio_handler"
	useranimehandler "myanimevault/internal/handlers/useranime_handler"
	"myanimevault/internal/middleware"
	animerepo "myanimevault/internal/repository/anime_repository"
	genrerepository "myanimevault/internal/repository/genre_repository"
	studiorepository "myanimevault/internal/repository/studio_repository"
	animeservice "myanimevault/internal/services/anime_service"
	genreservice "myanimevault/internal/services/genre_service"
	imageservice "myanimevault/internal/services/image_service"
	studioservice "myanimevault/internal/services/studio_service"
	"os"

	"github.com/gin-gonic/gin"
)

func InitRouter(server *gin.Engine) {
	//initialize dependencies
	animeRepo := animerepo.NewAnimeRepository()
	genreRepo := genrerepository.NewGenreRepository()
	studioRepo := studiorepository.NewStudioRepository()

	imageService, err := imageservice.NewImageService(os.Getenv("AWS_S3_REGION"), os.Getenv("AWS_S3_BUCKET_NAME"))
	if err != nil {
		panic(fmt.Sprintf("failed to create new image service: %v", err))
	}
	animeService := animeservice.NewAnimeService(animeRepo, imageService)
	genreService := genreservice.NewGenreService(genreRepo)
	studioService := studioservice.NewStudioService(studioRepo)

	animeHandler := animehandler.NewAnimeHandler(animeService)
	imageHandler := imagehandler.NewImageHandler(imageService)
	genreHandler := genrehandler.NewGenreHandler(genreService)
	studioHandler := studiohandler.NewStudioHandler(studioService)


	api := server.Group("/api")
	//auth routes
	api.GET("/users/getCurrentUser", middleware.Authenticate, authhandler.GetCurrentUserHandler)
	api.POST("/users/register", authhandler.RegisterHandler)
	api.POST("/users/login", authhandler.LoginHandler)
	api.DELETE("/users/logout", authhandler.LogoutHandler)

	//userAnime routes
	api.GET("/user/anime", middleware.Authenticate, useranimehandler.GetUserListHandler)
	api.GET("/user/anime/:animeId", middleware.Authenticate, useranimehandler.GetUserAnimeHandler)
	api.POST("/user/anime", middleware.Authenticate, useranimehandler.AddToListHandler)
	api.PATCH("/user/anime/:animeId", middleware.Authenticate, useranimehandler.UpdateUserAnimeHandler)
	api.DELETE("/user/anime/:animeId", middleware.Authenticate, useranimehandler.DeleteUserAnimeHandler)

	//anime routes
	api.POST("/anime", animeHandler.AddAnimeHandler)

	//image routes
	api.POST("/image/upload", imageHandler.UploadImageHandler)

	//genre routes
	api.GET("/genres", genreHandler.GetAllGenreHandler)

	//studio routes
	api.GET("/studios", studioHandler.GetAll)
}
