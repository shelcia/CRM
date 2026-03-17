package handlers

import (
	"context"
	"net/http"
	"time"

	"easycrm/db"
	"easycrm/models"
	"easycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateColumn(c *gin.Context) {
	projectID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	var body struct {
		Name string `json:"name"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Name == "" {
		utils.Err(c, http.StatusBadRequest, "Name is required")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Count existing columns to set order
	count, _ := db.Collection("columns").CountDocuments(ctx, bson.M{"projectId": projectID})

	col := models.Column{
		ID:        primitive.NewObjectID(),
		ProjectID: projectID,
		Name:      body.Name,
		Order:     int(count),
		CreatedAt: time.Now(),
	}

	if _, err := db.Collection("columns").InsertOne(ctx, col); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create column")
		return
	}

	c.JSON(http.StatusCreated, col)
}

func UpdateColumn(c *gin.Context) {
	colID, err := primitive.ObjectIDFromHex(c.Param("colId"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid column ID")
		return
	}

	var body struct {
		Name string `json:"name"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Name == "" {
		utils.Err(c, http.StatusBadRequest, "Name is required")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("columns").UpdateOne(
		ctx,
		bson.M{"_id": colID},
		bson.M{"$set": bson.M{"name": body.Name}},
	)
	if err != nil || result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Column not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"_id": colID, "name": body.Name})
}

func DeleteColumn(c *gin.Context) {
	colID, err := primitive.ObjectIDFromHex(c.Param("colId"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid column ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Move todos in this column to the first column of the same project, or delete them
	db.Collection("todos").DeleteMany(ctx, bson.M{"columnId": colID}) //nolint

	result, err := db.Collection("columns").DeleteOne(ctx, bson.M{"_id": colID})
	if err != nil || result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Column not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Column deleted"})
}
