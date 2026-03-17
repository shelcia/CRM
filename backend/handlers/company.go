package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"tinycrm/db"
	"tinycrm/models"
	"tinycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UploadCompanyLogo(c *gin.Context) {
	currentUser := c.MustGet("user").(models.User)

	companyID, err := primitive.ObjectIDFromHex(currentUser.CompanyID)
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid company ID")
		return
	}

	file, header, err := c.Request.FormFile("logo")
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "No file uploaded")
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".gif": true}
	if !allowed[ext] {
		utils.Err(c, http.StatusBadRequest, "Only image files are allowed (jpg, jpeg, png, webp, gif)")
		return
	}

	if err := os.MkdirAll("uploads/logos", 0755); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create upload directory")
		return
	}

	filename := fmt.Sprintf("%s%s", currentUser.CompanyID, ext)
	destPath := filepath.Join("uploads", "logos", filename)

	if err := c.SaveUploadedFile(header, destPath); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to save file")
		return
	}

	logoURL := fmt.Sprintf("/uploads/logos/%s", filename)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = db.Collection("companies").UpdateOne(ctx,
		bson.M{"_id": companyID},
		bson.M{"$set": bson.M{"logo": logoURL}},
	)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update company logo")
		return
	}

	c.JSON(http.StatusOK, gin.H{"logo": logoURL})
}

func GetCompany(c *gin.Context) {
	currentUser := c.MustGet("user").(models.User)

	companyID, err := primitive.ObjectIDFromHex(currentUser.CompanyID)
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid company ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var company models.Company
	if err := db.Collection("companies").FindOne(ctx, bson.M{"_id": companyID}).Decode(&company); err != nil {
		utils.Err(c, http.StatusNotFound, "Company not found")
		return
	}

	c.JSON(http.StatusOK, company)
}

func UpdateCompany(c *gin.Context) {
	currentUser := c.MustGet("user").(models.User)

	companyID, err := primitive.ObjectIDFromHex(currentUser.CompanyID)
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid company ID")
		return
	}

	var body models.Company
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	update := bson.M{"$set": bson.M{
		"name":        body.Name,
		"number":      body.Number,
		"cmail":       body.CMail,
		"address":     body.Address,
		"website":     body.Website,
		"companySize": body.CompanySize,
	}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("companies").UpdateOne(ctx, bson.M{"_id": companyID}, update)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update company")
		return
	}
	if result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Company not found")
		return
	}

	var updated models.Company
	db.Collection("companies").FindOne(ctx, bson.M{"_id": companyID}).Decode(&updated) //nolint
	c.JSON(http.StatusOK, updated)
}

func CreateCompany(c *gin.Context) {
	var company models.Company
	if err := c.ShouldBindJSON(&company); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	company.ID = primitive.NewObjectID()
	company.Date = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("companies").InsertOne(ctx, company); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create company")
		return
	}

	c.JSON(http.StatusCreated, company)
}
