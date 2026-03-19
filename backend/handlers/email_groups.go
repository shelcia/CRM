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
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetEmailGroups(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := db.Collection("email_groups").Find(ctx, bson.M{}, opts)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch email groups")
		return
	}
	defer cursor.Close(ctx)

	groups := make([]models.EmailGroup, 0)
	if err = cursor.All(ctx, &groups); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode email groups")
		return
	}

	c.JSON(http.StatusOK, groups)
}

func GetEmailGroup(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid group ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var group models.EmailGroup
	if err = db.Collection("email_groups").FindOne(ctx, bson.M{"_id": id}).Decode(&group); err != nil {
		utils.Err(c, http.StatusNotFound, "Email group not found")
		return
	}

	c.JSON(http.StatusOK, group)
}

func CreateEmailGroup(c *gin.Context) {
	var group models.EmailGroup
	if err := c.ShouldBindJSON(&group); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	group.ID = primitive.NewObjectID()
	group.CreatedAt = time.Now()
	group.UpdatedAt = time.Now()
	if group.ContactIDs == nil {
		group.ContactIDs = []string{}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("email_groups").InsertOne(ctx, group); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create email group")
		return
	}

	c.JSON(http.StatusCreated, group)
}

func UpdateEmailGroup(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid group ID")
		return
	}

	var body models.EmailGroup
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	body.UpdatedAt = time.Now()
	if body.ContactIDs == nil {
		body.ContactIDs = []string{}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{"$set": bson.M{
		"name":        body.Name,
		"description": body.Description,
		"contactIds":  body.ContactIDs,
		"updatedAt":   body.UpdatedAt,
	}}

	result, err := db.Collection("email_groups").UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update email group")
		return
	}
	if result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Email group not found")
		return
	}

	body.ID = id
	c.JSON(http.StatusOK, body)
}

func DeleteEmailGroup(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid group ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("email_groups").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to delete email group")
		return
	}
	if result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Email group not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email group deleted"})
}
