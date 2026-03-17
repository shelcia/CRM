package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Ticket struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Title    string             `bson:"title" json:"title"`
	Desc     string             `bson:"desc,omitempty" json:"desc,omitempty"`
	Client   string             `bson:"client" json:"client"`
	Status   string             `bson:"status" json:"status"`
	Priority string             `bson:"priority" json:"priority"`
	Assignee []string           `bson:"assignee,omitempty" json:"assignee,omitempty"`
	History  []interface{}      `bson:"history,omitempty" json:"history,omitempty"`
	Date     time.Time          `bson:"date" json:"date"`
}
