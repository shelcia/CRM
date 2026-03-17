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

func GetContacts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.Collection("contacts").Find(ctx, bson.M{})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch contacts")
		return
	}
	defer cursor.Close(ctx)

	var contacts []models.Contact
	if err = cursor.All(ctx, &contacts); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode contacts")
		return
	}

	c.JSON(http.StatusOK, contacts)
}

func CreateContact(c *gin.Context) {
	var contact models.Contact
	if err := c.ShouldBindJSON(&contact); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	contact.ID = primitive.NewObjectID()
	contact.CreatedAt = time.Now()
	contact.LastActivity = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("contacts").InsertOne(ctx, contact); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create contact")
		return
	}

	c.JSON(http.StatusCreated, contact)
}
