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
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetEmailTemplates(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.M{"createdAt": -1})
	cursor, err := db.Collection("email_templates").Find(ctx, bson.M{}, opts)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch email templates")
		return
	}
	defer cursor.Close(ctx)

	var templates []models.EmailTemplate
	if err = cursor.All(ctx, &templates); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode email templates")
		return
	}

	c.JSON(http.StatusOK, templates)
}

func GetEmailTemplate(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid template ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var tmpl models.EmailTemplate
	if err = db.Collection("email_templates").FindOne(ctx, bson.M{"_id": id}).Decode(&tmpl); err != nil {
		utils.Err(c, http.StatusNotFound, "Email template not found")
		return
	}

	c.JSON(http.StatusOK, tmpl)
}

func CreateEmailTemplate(c *gin.Context) {
	var tmpl models.EmailTemplate
	if err := c.ShouldBindJSON(&tmpl); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	tmpl.ID = primitive.NewObjectID()
	tmpl.CreatedAt = time.Now()
	tmpl.UpdatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("email_templates").InsertOne(ctx, tmpl); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create email template")
		return
	}

	c.JSON(http.StatusCreated, tmpl)
}

func UpdateEmailTemplate(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid template ID")
		return
	}

	var body models.EmailTemplate
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	body.UpdatedAt = time.Now()

	update := bson.M{"$set": bson.M{
		"name":       body.Name,
		"subject":    body.Subject,
		"body":       body.Body,
		"recipient":  body.Recipient,
		"frequency":  body.Frequency,
		"sendDate":   body.SendDate,
		"sendTime":   body.SendTime,
		"dayOfWeek":  body.DayOfWeek,
		"dayOfMonth": body.DayOfMonth,
		"status":     body.Status,
		"updatedAt":  body.UpdatedAt,
	}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("email_templates").UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update email template")
		return
	}
	if result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Email template not found")
		return
	}

	body.ID = id
	c.JSON(http.StatusOK, body)
}

func DeleteEmailTemplate(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid template ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("email_templates").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to delete email template")
		return
	}
	if result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Email template not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email template deleted"})
}
