package handlers

import (
	"context"
	"net/http"
	"time"

	"easycrm/db"
	"easycrm/models"
	"easycrm/templates"
	"easycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	currentUser := c.MustGet("user").(models.User)

	cursor, err := db.Collection("users").Find(ctx, bson.M{"companyId": currentUser.CompanyID})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch users")
		return
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode users")
		return
	}

	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, users)
}

type createUserInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Role     string `json:"role" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

func CreateUser(c *gin.Context) {
	var input createUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	currentUser := c.MustGet("user").(models.User)

	var existing models.User
	if err := db.Collection("users").FindOne(ctx, bson.M{"email": input.Email}).Decode(&existing); err == nil {
		utils.Err(c, http.StatusBadRequest, "Email already registered")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	token, err := generateToken(input.Email)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	newUser := models.User{
		ID:        primitive.NewObjectID(),
		Name:      input.Name,
		Email:     input.Email,
		Password:  string(hash),
		Role:      input.Role,
		Token:     token,
		Verified:  true,
		Date:      time.Now(),
		CompanyID: currentUser.CompanyID,
		Company:   currentUser.Company,
	}

	if _, err = db.Collection("users").InsertOne(ctx, newUser); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	emailBody := templates.InviteUserEmail(input.Name, input.Email, input.Password)
	go utils.SendEmail(input.Email, "You're Invited to Easy CRM", emailBody)

	newUser.Password = ""
	// Frontend checks res.status === "200" for user creation
	utils.Success(c, http.StatusOK, gin.H{"user": newUser})
}
