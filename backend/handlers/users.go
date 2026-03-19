package handlers

import (
	"context"
	"net/http"
	"time"

	"tinycrm/db"
	"tinycrm/models"
	"tinycrm/templates"
	"tinycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	currentUser := c.MustGet("user").(models.User)

	if currentUser.CompanyID == "" {
		utils.Err(c, http.StatusForbidden, "User is not associated with a company")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.Collection("users").Find(ctx, bson.M{"companyId": currentUser.CompanyID})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch users")
		return
	}
	defer cursor.Close(ctx)

	users := make([]models.User, 0)
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
	Name        string   `json:"name" binding:"required"`
	Email       string   `json:"email" binding:"required,email"`
	Password    string   `json:"password" binding:"required,min=6"`
	Permissions []string `json:"permissions"`
}

func GetUser(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	if err = db.Collection("users").FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
		utils.Err(c, http.StatusNotFound, "User not found")
		return
	}

	user.Password = ""
	c.JSON(http.StatusOK, user)
}

type updateUserInput struct {
	Name        string   `json:"name"        binding:"required"`
	Email       string   `json:"email"       binding:"required,email"`
	Permissions []string `json:"permissions"`
}

func UpdateUser(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var input updateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	update := bson.M{"$set": bson.M{
		"name":        input.Name,
		"email":       input.Email,
		"permissions": input.Permissions,
	}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("users").UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update user")
		return
	}
	if result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "User not found")
		return
	}

	var updated models.User
	db.Collection("users").FindOne(ctx, bson.M{"_id": id}).Decode(&updated)
	updated.Password = ""
	c.JSON(http.StatusOK, updated)
}

func DeleteUser(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("users").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to delete user")
		return
	}
	if result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "User not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
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

	permissions := input.Permissions
	if permissions == nil {
		permissions = []string{}
	}

	newUser := models.User{
		ID:          primitive.NewObjectID(),
		Name:        input.Name,
		Email:       input.Email,
		Password:    string(hash),
		Token:       token,
		Verified:    true,
		Date:        time.Now(),
		CompanyID:   currentUser.CompanyID,
		Company:     currentUser.Company,
		Permissions: permissions,
	}

	if _, err = db.Collection("users").InsertOne(ctx, newUser); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	emailBody := templates.InviteUserEmail(input.Name, input.Email, input.Password)
	go utils.SendEmail(input.Email, "You're Invited to Tiny CRM", emailBody)

	newUser.Password = ""
	// Frontend checks res.status === "200" for user creation
	utils.Success(c, http.StatusOK, gin.H{"user": newUser})
}
