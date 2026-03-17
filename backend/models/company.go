package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Company struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name        string             `bson:"name" json:"name"`
	CreatedBy   string             `bson:"createdBy,omitempty" json:"createdBy,omitempty"`
	Number      string             `bson:"number,omitempty" json:"number,omitempty"`
	CMail       string             `bson:"cmail,omitempty" json:"cmail,omitempty"`
	Address     string             `bson:"address,omitempty" json:"address,omitempty"`
	Website     string             `bson:"website,omitempty" json:"website,omitempty"`
	CompanySize int                `bson:"companySize,omitempty" json:"companySize,omitempty"`
	Logo        []byte             `bson:"logo,omitempty" json:"logo,omitempty"`
	Date        time.Time          `bson:"date" json:"date"`
}
