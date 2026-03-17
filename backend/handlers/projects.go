package handlers

import (
	"context"
	"net/http"
	"time"

	"tinycrm/db"
	"tinycrm/models"
	"tinycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetProjects(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.Collection("projects").Find(ctx, bson.M{})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch projects")
		return
	}
	defer cursor.Close(ctx)

	projects := make([]models.Project, 0)
	if err = cursor.All(ctx, &projects); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode projects")
		return
	}

	c.JSON(http.StatusOK, projects)
}

func CreateProject(c *gin.Context) {
	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	project.ID = primitive.NewObjectID()
	project.CreatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("projects").InsertOne(ctx, project); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create project")
		return
	}

	// Insert default columns
	defaultNames := []string{"Todo", "In Progress", "Done"}
	defaultCols := make([]interface{}, len(defaultNames))
	for i, name := range defaultNames {
		defaultCols[i] = models.Column{
			ID:        primitive.NewObjectID(),
			ProjectID: project.ID,
			Name:      name,
			Order:     i,
			CreatedAt: time.Now(),
		}
	}
	db.Collection("columns").InsertMany(ctx, defaultCols) //nolint

	c.JSON(http.StatusCreated, project)
}

func UpdateProject(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	var body struct {
		Name string `json:"name"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("projects").UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"name": body.Name}},
	)
	if err != nil || result.MatchedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Project not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"_id": id, "name": body.Name})
}

func DeleteProject(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Cascade: delete all todos and columns in this project
	db.Collection("todos").DeleteMany(ctx, bson.M{"projectId": id})    //nolint
	db.Collection("columns").DeleteMany(ctx, bson.M{"projectId": id})  //nolint
	result, err := db.Collection("projects").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil || result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Project not found")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted"})
}

// GetBoard returns all columns for the project with their todos embedded, ordered by column order.
func GetBoard(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Fetch columns ordered by order field
	opts := options.Find().SetSort(bson.D{{Key: "order", Value: 1}})
	cursor, err := db.Collection("columns").Find(ctx, bson.M{"projectId": id}, opts)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch columns")
		return
	}
	defer cursor.Close(ctx)

	columns := make([]models.Column, 0)
	if err = cursor.All(ctx, &columns); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode columns")
		return
	}

	// Fetch all todos for this project
	todoCursor, err := db.Collection("todos").Find(ctx, bson.M{"projectId": id})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch todos")
		return
	}
	defer todoCursor.Close(ctx)

	todos := make([]models.Todo, 0)
	if err = todoCursor.All(ctx, &todos); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode todos")
		return
	}

	// Group todos by columnId
	todosByCol := make(map[primitive.ObjectID][]models.Todo)
	for _, t := range todos {
		todosByCol[t.ColumnID] = append(todosByCol[t.ColumnID], t)
	}

	// Build response
	board := make([]models.ColumnWithTodos, len(columns))
	for i, col := range columns {
		colTodos := todosByCol[col.ID]
		if colTodos == nil {
			colTodos = []models.Todo{}
		}
		board[i] = models.ColumnWithTodos{Column: col, Todos: colTodos}
	}

	c.JSON(http.StatusOK, board)
}
