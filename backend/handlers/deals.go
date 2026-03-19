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

func GetDeals(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	if contactID := c.Query("contactId"); contactID != "" {
		filter["contactId"] = contactID
	}

	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := db.Collection("deals").Find(ctx, filter, opts)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch deals")
		return
	}
	defer cursor.Close(ctx)

	deals := make([]models.Deal, 0)
	if err = cursor.All(ctx, &deals); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode deals")
		return
	}

	c.JSON(http.StatusOK, deals)
}

func GetDeal(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid deal ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var deal models.Deal
	if err = db.Collection("deals").FindOne(ctx, bson.M{"_id": id}).Decode(&deal); err != nil {
		utils.Err(c, http.StatusNotFound, "Deal not found")
		return
	}

	c.JSON(http.StatusOK, deal)
}

func CreateDeal(c *gin.Context) {
	var deal models.Deal
	if err := c.ShouldBindJSON(&deal); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	deal.ID = primitive.NewObjectID()
	deal.CreatedAt = time.Now()
	deal.UpdatedAt = time.Now()

	if deal.Currency == "" {
		deal.Currency = "USD"
	}
	if deal.Stage == "" {
		deal.Stage = "lead"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("deals").InsertOne(ctx, deal); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create deal")
		return
	}

	c.JSON(http.StatusCreated, deal)
}

func UpdateDeal(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid deal ID")
		return
	}

	var body models.Deal
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	body.UpdatedAt = time.Now()

	update := bson.M{"$set": bson.M{
		"title":         body.Title,
		"contactId":     body.ContactID,
		"contactName":   body.ContactName,
		"value":         body.Value,
		"currency":      body.Currency,
		"stage":         body.Stage,
		"assignedTo":    body.AssignedTo,
		"expectedClose": body.ExpectedClose,
		"updatedAt":     body.UpdatedAt,
	}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("deals").UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update deal")
		return
	}
	if result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Deal not found")
		return
	}

	body.ID = id
	c.JSON(http.StatusOK, body)
}

func DeleteDeal(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid deal ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("deals").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to delete deal")
		return
	}
	if result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Deal not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deal deleted"})
}
