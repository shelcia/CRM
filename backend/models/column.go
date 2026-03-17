package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Column struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	ProjectID primitive.ObjectID `bson:"projectId" json:"projectId"`
	Name      string             `bson:"name" json:"name"`
	Order     int                `bson:"order" json:"order"`
	CreatedAt time.Time          `bson:"date" json:"date"`
}

// ColumnWithTodos is returned by the board endpoint
type ColumnWithTodos struct {
	Column
	Todos []Todo `json:"todos"`
}
