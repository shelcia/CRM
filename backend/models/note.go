package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// NoteType distinguishes manual notes from activity-log entries.
// The frontend can filter/render each type differently.
type NoteType string

const (
	NoteTypeNote     NoteType = "note"
	NoteTypeCall     NoteType = "call"
	NoteTypeEmail    NoteType = "email"
	NoteTypeMeeting  NoteType = "meeting"
	NoteTypeActivity NoteType = "activity" // auto-generated (e.g. status change)
)

type Note struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"  json:"_id"`
	ContactID primitive.ObjectID `bson:"contactId"      json:"contactId"`
	Type      NoteType           `bson:"type"           json:"type"`
	Body      string             `bson:"body"           json:"body"`
	Author    string             `bson:"author"         json:"author"` // user name from JWT
	CreatedAt time.Time          `bson:"createdAt"      json:"createdAt"`
}
