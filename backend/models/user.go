package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name        string             `bson:"name" json:"name"`
	Email       string             `bson:"email" json:"email"`
	Password    string             `bson:"password" json:"password,omitempty"`
	Role        string             `bson:"role" json:"role"`
	Token       string             `bson:"token,omitempty" json:"token,omitempty"`
	Permissions []string           `bson:"permissions" json:"permissions"`
	Verified    bool               `bson:"verified" json:"verified"`
	Date        time.Time          `bson:"date" json:"date"`
	CompanyID   string             `bson:"companyId,omitempty" json:"companyId,omitempty"`
	Company     string             `bson:"company,omitempty" json:"company,omitempty"`
}
