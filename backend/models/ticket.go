package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// JSON tags match the field names the frontend form (AddTicket) sends
// and the Tickets table reads.
type Ticket struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description,omitempty" json:"description,omitempty"`
	Contact     string             `bson:"contact" json:"contact"`
	Email       string             `bson:"email,omitempty" json:"email,omitempty"`
	Category    string             `bson:"category" json:"category"`
	Priority    string             `bson:"priority" json:"priority"`
	Status      string             `bson:"status" json:"status"`
	AssignedTo  string             `bson:"assignedTo,omitempty" json:"assignedTo,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}
