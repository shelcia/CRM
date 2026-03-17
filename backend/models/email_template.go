package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// EmailTemplate stores a user-created email template with scheduling info.
// JSON tags match the frontend EmailTemplate interface in Emails.tsx.
type EmailTemplate struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"      json:"_id,omitempty"`
	Name       string             `bson:"name"               json:"name"`
	Subject    string             `bson:"subject"            json:"subject"`
	Body       string             `bson:"body"               json:"body"`
	Recipient  string             `bson:"recipient"          json:"recipient"`
	Frequency  string             `bson:"frequency"          json:"frequency"`  // one-time | daily | weekly | monthly
	SendDate   string             `bson:"sendDate"           json:"sendDate"`   // YYYY-MM-DD
	SendTime   string             `bson:"sendTime"           json:"sendTime"`   // HH:MM
	DayOfWeek  string             `bson:"dayOfWeek,omitempty" json:"dayOfWeek,omitempty"`
	DayOfMonth string             `bson:"dayOfMonth,omitempty" json:"dayOfMonth,omitempty"`
	Status     string             `bson:"status"             json:"status"`     // active | draft | paused
	CreatedAt  time.Time          `bson:"createdAt"          json:"createdAt"`
	UpdatedAt  time.Time          `bson:"updatedAt"          json:"updatedAt"`
}
