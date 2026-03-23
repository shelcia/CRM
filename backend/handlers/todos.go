package handlers

import (
	"context"
	"net/http"
	"time"

	"tinycrm/db"
	"tinycrm/models"
	"tinycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateTodo(c *gin.Context) {
	projectID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid project ID", err)
		return
	}

	var todo models.Todo
	if err := c.ShouldBindJSON(&todo); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	todo.ID = primitive.NewObjectID()
	todo.ProjectID = projectID
	todo.CreatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("todos").InsertOne(ctx, todo); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create todo", err)
		return
	}

	c.JSON(http.StatusCreated, todo)
}

func UpdateTodo(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid todo ID", err)
		return
	}

	var body bson.M
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	// Convert columnId string to ObjectID if present
	if colStr, ok := body["columnId"].(string); ok {
		colOID, err := primitive.ObjectIDFromHex(colStr)
		if err != nil {
			utils.Err(c, http.StatusBadRequest, "Invalid column ID", err)
			return
		}
		body["columnId"] = colOID
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("todos").UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": body},
	)
	if err != nil || result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Todo not found", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo updated"})
}

func DeleteTodo(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid todo ID", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("todos").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil || result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Todo not found", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
}
