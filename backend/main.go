package main

import (
	"log"
	"os"

	"tinycrm/config"
	"tinycrm/db"
	"tinycrm/handlers"
	"tinycrm/middleware"
	"tinycrm/scheduler"

	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	db.Connect()
	scheduler.Start()

	r := gin.Default()

	r.Static("/uploads", "./uploads")

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, auth-token")
		c.Header("Access-Control-Expose-Headers", "auth-token")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.Use(middleware.RateLimit())

	api := r.Group("/api")
	{
		api.GET("/enums", handlers.GetEnums)

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
			users.GET("", handlers.GetUsers)
			users.POST("", handlers.CreateUser)
			users.GET("/:id", handlers.GetUser)
			users.PUT("/:id", handlers.UpdateUser)
			users.DELETE("/:id", handlers.DeleteUser)
		}

		contacts := api.Group("/contacts")
		contacts.Use(middleware.Auth())
		{
			contacts.GET("", handlers.GetContacts)
			contacts.POST("", handlers.CreateContact)
			contacts.GET("/export", handlers.ExportContacts)
			contacts.POST("/import", handlers.ImportContacts)
			contacts.PUT("/:id", handlers.UpdateContact)
			contacts.DELETE("/:id", handlers.DeleteContact)
			contacts.GET("/:id/notes", handlers.GetNotes)
			contacts.POST("/:id/notes", handlers.AddNote)
			contacts.DELETE("/:id/notes/:noteId", handlers.DeleteNote)
		}

		company := api.Group("/company")
		company.Use(middleware.Auth())
		{
			company.GET("", handlers.GetCompany)
			company.POST("", handlers.CreateCompany)
			company.PUT("", handlers.UpdateCompany)
			company.POST("/logo", handlers.UploadCompanyLogo)
		}

		projects := api.Group("/projects")
		projects.Use(middleware.Auth())
		{
			projects.GET("", handlers.GetProjects)
			projects.POST("", handlers.CreateProject)
			projects.PUT("/:id", handlers.UpdateProject)
			projects.DELETE("/:id", handlers.DeleteProject)
			projects.GET("/:id/board", handlers.GetBoard)
			projects.POST("/:id/columns", handlers.CreateColumn)
			projects.PUT("/:id/columns/reorder", handlers.ReorderColumns)
			projects.PUT("/:id/columns/:colId", handlers.UpdateColumn)
			projects.DELETE("/:id/columns/:colId", handlers.DeleteColumn)
			projects.POST("/:id/todos", handlers.CreateTodo)
		}

		tickets := api.Group("/tickets")
		tickets.Use(middleware.Auth())
		{
			tickets.GET("", handlers.GetTickets)
			tickets.POST("", handlers.CreateTicket)
			tickets.GET("/:id", handlers.GetTicket)
			tickets.PUT("/:id", handlers.UpdateTicket)
			tickets.DELETE("/:id", handlers.DeleteTicket)
		}

		todos := api.Group("/todos")
		todos.Use(middleware.Auth())
		{
			todos.PUT("/:id", handlers.UpdateTodo)
			todos.DELETE("/:id", handlers.DeleteTodo)
		}

		dashboard := api.Group("/dashboard")
		dashboard.Use(middleware.Auth())
		{
			dashboard.GET("/stats", handlers.GetDashboardStats)
		}

		emailTemplates := api.Group("/email-templates")
		emailTemplates.Use(middleware.Auth())
		{
			emailTemplates.GET("", handlers.GetEmailTemplates)
			emailTemplates.POST("", handlers.CreateEmailTemplate)
			emailTemplates.GET("/:id", handlers.GetEmailTemplate)
			emailTemplates.PUT("/:id", handlers.UpdateEmailTemplate)
			emailTemplates.DELETE("/:id", handlers.DeleteEmailTemplate)
		}

		deals := api.Group("/deals")
		deals.Use(middleware.Auth())
		{
			deals.GET("", handlers.GetDeals)
			deals.POST("", handlers.CreateDeal)
			deals.GET("/:id", handlers.GetDeal)
			deals.PUT("/:id", handlers.UpdateDeal)
			deals.DELETE("/:id", handlers.DeleteDeal)
		}

		emailGroups := api.Group("/email-groups")
		emailGroups.Use(middleware.Auth())
		{
			emailGroups.GET("", handlers.GetEmailGroups)
			emailGroups.POST("", handlers.CreateEmailGroup)
			emailGroups.GET("/:id", handlers.GetEmailGroup)
			emailGroups.PUT("/:id", handlers.UpdateEmailGroup)
			emailGroups.DELETE("/:id", handlers.DeleteEmailGroup)
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
