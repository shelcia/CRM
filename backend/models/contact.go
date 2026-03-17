package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// JSON tags use the same field names the frontend form (AddContact) sends,
// and that the Contacts table reads.
type Contact struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name            string             `bson:"name" json:"name"`
	Email           string             `bson:"mail" json:"email"`
	Number          string             `bson:"number" json:"number"`
	Company         string             `bson:"company" json:"company"`
	ContactOwner    string             `bson:"contactOwner,omitempty" json:"contactOwner,omitempty"`
	Assignee        []string           `bson:"assignee,omitempty" json:"assignee,omitempty"`
	Priority        string             `bson:"priority,omitempty" json:"priority,omitempty"`
	CompanySize     int                `bson:"companySize,omitempty" json:"companySize,omitempty"`
	JobTitle        string             `bson:"jobTitle,omitempty" json:"jobTitle,omitempty"`
	ExpectedRevenue float64            `bson:"expectedRevenue,omitempty" json:"expectedRevenue,omitempty"`
	ExpectedClosing *time.Time         `bson:"expectedClosing,omitempty" json:"expectedClosing,omitempty"`
	Probability     string             `bson:"probability,omitempty" json:"probability,omitempty"`
	Status          string             `bson:"status" json:"status"`
	LastActivity    time.Time          `bson:"lastActivity" json:"lastActivity"`
	CreatedAt       time.Time          `bson:"date" json:"createdAt"`
}
