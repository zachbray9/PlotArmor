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
	sessionrepository "myanimevault/internal/repository/session_repository"
	studiorepository "myanimevault/internal/repository/studio_repository"
	userrepository "myanimevault/internal/repository/user_repository"
	useranimerepository "myanimevault/internal/repository/useranime_repository"
	animeservice "myanimevault/internal/services/anime_service"
	authservice "myanimevault/internal/services/auth_service"
	genreservice "myanimevault/internal/services/genre_service"
	imageservice "myanimevault/internal/services/image_service"
	sessionservice "myanimevault/internal/services/session_service"
	studioservice "myanimevault/internal/services/studio_service"
	userservice "myanimevault/internal/services/user_service"
	useranimeservice "myanimevault/internal/services/useranime_service"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func InitRouter(server *gin.Engine) {
	//initialize dependencies
	googleOAuthConfig := &oauth2.Config{
		RedirectURL: os.Getenv("GOOGLE_REDIRECT_URI"),
		ClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes: []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint: google.Endpoint,
	}

	userRepo := userrepository.NewUserRepo()
	sessionRepo := sessionrepository.NewSessionRepository()
	animeRepo := animerepo.NewAnimeRepository()
	genreRepo := genrerepository.NewGenreRepository()
	studioRepo := studiorepository.NewStudioRepository()
	userAnimeRepo := useranimerepository.NewUserAnimeRepository()

	imageService, err := imageservice.NewImageService(os.Getenv("AWS_S3_REGION"), os.Getenv("AWS_S3_BUCKET_NAME"))
	if err != nil {
		panic(fmt.Sprintf("failed to create new image service: %v", err))
	}
	userService := userservice.NewUserService(userRepo)
	sessionService := sessionservice.NewSessionService(sessionRepo)
	authService := authservice.NewAuthService(*userService, *sessionService, userRepo)
	animeService := animeservice.NewAnimeService(animeRepo, genreRepo, studioRepo, imageService)
	genreService := genreservice.NewGenreService(genreRepo)
	studioService := studioservice.NewStudioService(studioRepo)
	userAnimeService := useranimeservice.NewUserAnimeService(userAnimeRepo, animeRepo)

	authHandler := authhandler.NewAuthHandler(authService, googleOAuthConfig)
	animeHandler := animehandler.NewAnimeHandler(animeService)
	imageHandler := imagehandler.NewImageHandler(imageService)
	genreHandler := genrehandler.NewGenreHandler(genreService)
	studioHandler := studiohandler.NewStudioHandler(studioService)
	userAnimeHandler := useranimehandler.NewUserAnimeHandler(userAnimeService, imageService)

	api := server.Group("/api")
	//auth routes
	api.GET("/users/getCurrentUser", middleware.Authenticate, authHandler.GetCurrentUserHandler)
	api.GET("/auth/google/login", authHandler.GoogleLogin)
	api.GET("/auth/google/callback", authHandler.GoogleCallBack)
	api.POST("/users/register", authHandler.RegisterHandler)
	api.POST("/users/login", authHandler.LoginHandler)
	api.DELETE("/users/logout", authhandler.LogoutHandler)

	//userAnime routes
	api.GET("/user/anime", middleware.Authenticate, userAnimeHandler.GetUserListHandler)
	api.GET("/user/anime/:animeId", middleware.Authenticate, userAnimeHandler.GetUserAnimeHandler)
	api.POST("/user/anime", middleware.Authenticate, userAnimeHandler.AddToListHandler)
	api.PATCH("/user/anime/:animeId", middleware.Authenticate, userAnimeHandler.UpdateUserAnimeHandler)
	api.DELETE("/user/anime/:animeId", middleware.Authenticate, userAnimeHandler.DeleteUserAnimeHandler)

	//home page data
	api.GET("/home", animeHandler.GetHomePageDataHandler)

	//anime routes
	api.GET("/anime/:animeId", animeHandler.GetById)
	api.GET("/anime/search", animeHandler.Search)
	api.GET("/anime/genre/:genreId", animeHandler.GetByGenre)
	api.POST("/anime", middleware.Authenticate, middleware.RequireAdmin, animeHandler.AddAnimeHandler)
	api.POST("/anime/recommendations", animeHandler.GenerateRecommendations)

	//image routes
	api.POST("/images/upload", imageHandler.UploadImageHandler)

	//genre routes
	api.GET("/genres", genreHandler.GetAllGenreHandler)

	//studio routes
	api.GET("/studios", studioHandler.GetAll)
}
