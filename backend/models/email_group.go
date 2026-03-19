package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EmailGroup struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description,omitempty" json:"description,omitempty"`
	ContactIDs  []string           `bson:"contactIds" json:"contactIds"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}
