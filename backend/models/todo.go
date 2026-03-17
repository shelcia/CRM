package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TodoAuthor struct {
	Name  string `bson:"name" json:"name"`
	Image string `bson:"image" json:"image"`
}

type Todo struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	ProjectID   primitive.ObjectID `bson:"projectId" json:"projectId"`
	ColumnID    primitive.ObjectID `bson:"columnId" json:"columnId"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Author      TodoAuthor         `bson:"author" json:"author"`
	StatusColor string             `bson:"statusColor,omitempty" json:"statusColor,omitempty"`
	CreatedAt   time.Time          `bson:"date" json:"date"`
}
