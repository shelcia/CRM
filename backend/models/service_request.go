package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ServiceRequest struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Title           string             `bson:"title" json:"title"`
	Client          string             `bson:"client" json:"client"`
	Manager         string             `bson:"manager" json:"manager"`
	ExpectedRevenue float64            `bson:"expected_revenue" json:"expected_revenue"`
	Probability     float64            `bson:"probability" json:"probability"`
	Status          string             `bson:"status" json:"status"`
	ExpectedClosing time.Time          `bson:"expected_closing" json:"expected_closing"`
	Priority        string             `bson:"priority" json:"priority"`
	Date            time.Time          `bson:"date" json:"date"`
}
