package handlers

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
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
		utils.Err(c, http.StatusBadRequest, "Invalid company ID", err)
		return
	}

	file, header, err := c.Request.FormFile("logo")
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "No file uploaded", err)
		return
	}
	defer file.Close()

	mimeTypes := map[string]string{
		".jpg": "image/jpeg", ".jpeg": "image/jpeg",
		".png": "image/png", ".webp": "image/webp", ".gif": "image/gif",
	}
	ext := strings.ToLower(header.Filename[strings.LastIndex(header.Filename, "."):])
	mime, ok := mimeTypes[ext]
	if !ok {
		utils.Err(c, http.StatusBadRequest, "Only image files are allowed (jpg, jpeg, png, webp, gif)")
		return
	}

	if header.Size > 5<<20 {
		utils.Err(c, http.StatusBadRequest, "File exceeds 5 MB limit")
		return
	}

	data, err := io.ReadAll(file)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to read file", err)
		return
	}

	dataURI := fmt.Sprintf("data:%s;base64,%s", mime, base64.StdEncoding.EncodeToString(data))

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = db.Collection("companies").UpdateOne(ctx,
		bson.M{"_id": companyID},
		bson.M{"$set": bson.M{"logo": dataURI}},
	)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update company logo", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"logo": dataURI})
}

func GetCompany(c *gin.Context) {
	currentUser := c.MustGet("user").(models.User)

	companyID, err := primitive.ObjectIDFromHex(currentUser.CompanyID)
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid company ID", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var company models.Company
	if err := db.Collection("companies").FindOne(ctx, bson.M{"_id": companyID}).Decode(&company); err != nil {
		utils.Err(c, http.StatusNotFound, "Company not found", err)
		return
	}

	c.JSON(http.StatusOK, company)
}

func UpdateCompany(c *gin.Context) {
	currentUser := c.MustGet("user").(models.User)

	companyID, err := primitive.ObjectIDFromHex(currentUser.CompanyID)
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid company ID", err)
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
		utils.Err(c, http.StatusInternalServerError, "Failed to update company", err)
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
		utils.Err(c, http.StatusInternalServerError, "Failed to create company", err)
		return
	}

	c.JSON(http.StatusCreated, company)
}
