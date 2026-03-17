package handlers

import (
	"context"
	"net/http"
	"os"
	"time"

	"easycrm/db"
	"easycrm/models"
	"easycrm/templates"
	"easycrm/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type registerInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Company  string `json:"company" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

type loginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var input registerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var existingCompany models.Company
	if err := db.Collection("companies").FindOne(ctx, bson.M{"name": input.Company}).Decode(&existingCompany); err == nil {
		utils.Err(c, http.StatusBadRequest, "Company name already exists")
		return
	}

	var existingUser models.User
	if err := db.Collection("users").FindOne(ctx, bson.M{"email": input.Email}).Decode(&existingUser); err == nil {
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

	user := models.User{
		ID:       primitive.NewObjectID(),
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hash),
		Role:     input.Role,
		Token:    token,
		Verified: false,
		Date:     time.Now(),
	}

	if _, err = db.Collection("users").InsertOne(ctx, user); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	company := models.Company{
		ID:        primitive.NewObjectID(),
		Name:      input.Company,
		CreatedBy: user.ID.Hex(),
		Date:      time.Now(),
	}

	if _, err = db.Collection("companies").InsertOne(ctx, company); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create company")
		return
	}

	db.Collection("users").UpdateOne(ctx,
		bson.M{"_id": user.ID},
		bson.M{"$set": bson.M{
			"companyId": company.ID.Hex(),
			"company":   company.Name,
		}},
	)

	encryptedEmail, err := utils.Encrypt(input.Email)
	if err == nil {
		frontendLink := os.Getenv("FRONTEND_LINK")
		if frontendLink == "" {
			frontendLink = "http://127.0.0.1:5173/"
		}
		verificationURL := frontendLink + "verification/" + encryptedEmail
		emailBody := templates.VerificationEmail(input.Name, verificationURL)
		go utils.SendEmail(input.Email, "Verify Your Email - Easy CRM", emailBody)
	}

	// Frontend checks res.status === "201"
	utils.Success(c, http.StatusCreated, "Registration successful. Please verify your email.")
}

func Login(c *gin.Context) {
	var input loginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	if err := db.Collection("users").FindOne(ctx, bson.M{"email": input.Email}).Decode(&user); err != nil {
		utils.Err(c, http.StatusBadRequest, "Email or password is incorrect")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		utils.Err(c, http.StatusBadRequest, "Email or password is incorrect")
		return
	}

	if !user.Verified {
		// Frontend checks res.status === "401" to redirect to /verification
		utils.Err(c, http.StatusUnauthorized, "Please verify your email before logging in")
		return
	}

	token, err := generateToken(user.Email)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	db.Collection("users").UpdateOne(ctx,
		bson.M{"_id": user.ID},
		bson.M{"$set": bson.M{"token": token}},
	)

	c.Header("auth-token", token)

	// Frontend reads: res.message.id, res.message.name, res.message.email,
	// res.message.type (role), res.message.token, res.message.companyId, res.message.company
	utils.Success(c, http.StatusOK, gin.H{
		"id":        user.ID.Hex(),
		"name":      user.Name,
		"email":     user.Email,
		"type":      user.Role,
		"token":     token,
		"companyId": user.CompanyID,
		"company":   user.Company,
	})
}

func VerifyEmail(c *gin.Context) {
	email, err := utils.Decrypt(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid verification link")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("users").UpdateOne(ctx,
		bson.M{"email": email},
		bson.M{"$set": bson.M{"verified": true}},
	)
	if err != nil || result.MatchedCount == 0 {
		utils.Err(c, http.StatusBadRequest, "User not found")
		return
	}

	utils.Success(c, http.StatusOK, "Email verified successfully")
}

func ResendVerification(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	if err := db.Collection("users").FindOne(ctx, bson.M{"email": input.Email}).Decode(&user); err != nil {
		utils.Err(c, http.StatusBadRequest, "User not found")
		return
	}

	encryptedEmail, err := utils.Encrypt(input.Email)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to generate verification link")
		return
	}

	frontendLink := os.Getenv("FRONTEND_LINK")
	if frontendLink == "" {
		frontendLink = "http://127.0.0.1:5173/"
	}
	verificationURL := frontendLink + "verification/" + encryptedEmail
	emailBody := templates.VerificationEmail(user.Name, verificationURL)
	go utils.SendEmail(input.Email, "Verify Your Email - Easy CRM", emailBody)

	utils.Success(c, http.StatusOK, "Verification email sent")
}

func ResetPassword(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	if err := db.Collection("users").FindOne(ctx, bson.M{"email": input.Email}).Decode(&user); err != nil {
		utils.Err(c, http.StatusBadRequest, "User not found")
		return
	}

	encryptedEmail, err := utils.Encrypt(input.Email)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to generate reset link")
		return
	}

	frontendLink := os.Getenv("FRONTEND_LINK")
	if frontendLink == "" {
		frontendLink = "http://127.0.0.1:5173/"
	}
	resetURL := frontendLink + "reset-password/" + encryptedEmail
	emailBody := templates.ResetPasswordEmail(user.Name, resetURL)
	go utils.SendEmail(input.Email, "Reset Your Password - Easy CRM", emailBody)

	utils.Success(c, http.StatusOK, "Password reset email sent")
}

func ChangePassword(c *gin.Context) {
	email, err := utils.Decrypt(c.Param("token"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid reset link")
		return
	}

	var input struct {
		Password string `json:"password" binding:"required,min=6"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("users").UpdateOne(ctx,
		bson.M{"email": email},
		bson.M{"$set": bson.M{"password": string(hash)}},
	)
	if err != nil || result.MatchedCount == 0 {
		utils.Err(c, http.StatusBadRequest, "User not found")
		return
	}

	utils.Success(c, http.StatusOK, "Password updated successfully")
}

func generateToken(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("TOKEN_SECRET")))
}
