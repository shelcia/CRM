package main

import (
	"log"
	"os"

	"easycrm/config"
	"easycrm/db"
	"easycrm/handlers"
	"easycrm/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	db.Connect()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "auth-token"},
		ExposeHeaders:    []string{"auth-token"},
		AllowCredentials: true,
	}))

	r.Use(middleware.RateLimit())

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
			auth.PUT("/verification/:id", handlers.VerifyEmail)
			auth.POST("/resend", handlers.ResendVerification)
			auth.POST("/reset-password", handlers.ResetPassword)
			auth.PUT("/change-password/:token", handlers.ChangePassword)
		}

		users := api.Group("/users")
		users.Use(middleware.Auth())
		{
			users.GET("/", handlers.GetUsers)
			users.POST("/", handlers.CreateUser)
		}

		contacts := api.Group("/contacts")
		contacts.Use(middleware.Auth())
		{
			contacts.GET("/", handlers.GetContacts)
			contacts.POST("/", handlers.CreateContact)
		}

		company := api.Group("/company")
		company.Use(middleware.Auth())
		{
			company.GET("/", handlers.GetCompany)
			company.POST("/", handlers.CreateCompany)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "4050"
	}

	log.Printf("Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
