package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Deal struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Title         string             `bson:"title" json:"title"`
	ContactID     string             `bson:"contactId,omitempty" json:"contactId,omitempty"`
	ContactName   string             `bson:"contactName,omitempty" json:"contactName,omitempty"`
	Value         float64            `bson:"value" json:"value"`
	Currency      string             `bson:"currency" json:"currency"`
	Stage         string             `bson:"stage" json:"stage"`
	AssignedTo    string             `bson:"assignedTo,omitempty" json:"assignedTo,omitempty"`
	ExpectedClose *time.Time         `bson:"expectedClose,omitempty" json:"expectedClose,omitempty"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
}
