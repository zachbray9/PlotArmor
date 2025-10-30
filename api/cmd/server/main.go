package main

import (
	"myanimevault/config"
	"myanimevault/internal/database"
	"myanimevault/internal/routes"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	config.InitEnvVariables()

	if os.Getenv("MODE") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	database.InitDb()
	database.RunMigrationsAndSeedData()

	var server = gin.Default()

	//cors policy
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "https://plotarmor.site", "https://www.plotarmor.site"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	config.MaxAge = 12 * time.Hour

	server.Use(cors.New(config))

	//initialize api endpoints
	routes.InitRouter(server)

	port := os.Getenv("PORT")
	server.Run("0.0.0.0:" + port)
}
