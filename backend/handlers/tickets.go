package handlers

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"tinycrm/db"
	"tinycrm/models"
	"tinycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetTickets(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	search := strings.TrimSpace(c.Query("search"))
	status := strings.TrimSpace(c.Query("status"))
	priority := strings.TrimSpace(c.Query("priority"))
	category := strings.TrimSpace(c.Query("category"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 200 {
		limit = 50
	}

	filter := bson.M{}
	if search != "" {
		filter["$or"] = bson.A{
			bson.M{"title": bson.M{"$regex": search, "$options": "i"}},
			bson.M{"contact": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if status != "" {
		filter["status"] = status
	}
	if priority != "" {
		filter["priority"] = priority
	}
	if category != "" {
		filter["category"] = category
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	total, _ := db.Collection("tickets").CountDocuments(ctx, filter)

	opts := options.Find().
		SetSkip(int64((page - 1) * limit)).
		SetLimit(int64(limit)).
		SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := db.Collection("tickets").Find(ctx, filter, opts)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch tickets")
		return
	}
	defer cursor.Close(ctx)

	tickets := make([]models.Ticket, 0)
	if err = cursor.All(ctx, &tickets); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode tickets")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  tickets,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func GetTicket(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid ticket ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var ticket models.Ticket
	if err = db.Collection("tickets").FindOne(ctx, bson.M{"_id": id}).Decode(&ticket); err != nil {
		utils.Err(c, http.StatusNotFound, "Ticket not found")
		return
	}

	c.JSON(http.StatusOK, ticket)
}

func CreateTicket(c *gin.Context) {
	var ticket models.Ticket
	if err := c.ShouldBindJSON(&ticket); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	ticket.ID = primitive.NewObjectID()
	ticket.CreatedAt = time.Now()
	ticket.UpdatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("tickets").InsertOne(ctx, ticket); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create ticket")
		return
	}

	c.JSON(http.StatusCreated, ticket)
}

func UpdateTicket(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid ticket ID")
		return
	}

	var body models.Ticket
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	body.UpdatedAt = time.Now()

	update := bson.M{"$set": bson.M{
		"title":       body.Title,
		"description": body.Description,
		"contact":     body.Contact,
		"email":       body.Email,
		"category":    body.Category,
		"priority":    body.Priority,
		"status":      body.Status,
		"assignedTo":  body.AssignedTo,
		"updatedAt":   body.UpdatedAt,
	}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("tickets").UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to update ticket")
		return
	}
	if result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Ticket not found")
		return
	}

	body.ID = id
	c.JSON(http.StatusOK, body)
}

func DeleteTicket(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid ticket ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("tickets").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to delete ticket")
		return
	}
	if result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Ticket not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket deleted"})
}
