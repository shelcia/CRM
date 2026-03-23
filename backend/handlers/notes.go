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

// GET /api/contacts/:id/notes
// Returns all notes for a contact, newest first.
func GetNotes(c *gin.Context) {
	contactID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid contact ID", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := db.Collection("contact_notes").Find(ctx, bson.M{"contactId": contactID}, opts)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch notes", err)
		return
	}
	defer cursor.Close(ctx)

	notes := make([]models.Note, 0)
	if err = cursor.All(ctx, &notes); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode notes", err)
		return
	}

	c.JSON(http.StatusOK, notes)
}

// POST /api/contacts/:id/notes
// Body: { "type": "note|call|email|meeting", "body": "..." }
func AddNote(c *gin.Context) {
	contactID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid contact ID", err)
		return
	}

	var body struct {
		Type models.NoteType `json:"type"`
		Body string          `json:"body"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Body == "" {
		utils.Err(c, http.StatusBadRequest, "body is required")
		return
	}
	if body.Type == "" {
		body.Type = models.NoteTypeNote
	}

	user, _ := c.Get("user")
	authorName := ""
	if u, ok := user.(models.User); ok {
		authorName = u.Name
	}

	note := models.Note{
		ID:        primitive.NewObjectID(),
		ContactID: contactID,
		Type:      body.Type,
		Body:      body.Body,
		Author:    authorName,
		CreatedAt: time.Now(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("contact_notes").InsertOne(ctx, note); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to save note", err)
		return
	}

	// Bump contact's lastActivity
	db.Collection("contacts").UpdateOne(ctx,
		bson.M{"_id": contactID},
		bson.M{"$set": bson.M{"lastActivity": note.CreatedAt}},
	)

	c.JSON(http.StatusCreated, note)
}

// DELETE /api/contacts/:id/notes/:noteId
func DeleteNote(c *gin.Context) {
	noteID, err := primitive.ObjectIDFromHex(c.Param("noteId"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid note ID", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("contact_notes").DeleteOne(ctx, bson.M{"_id": noteID})
	if err != nil || result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Note not found", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": noteID})
}
