package handlers

import (
	"context"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"easycrm/db"
	"easycrm/models"
	"easycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetContacts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.Collection("contacts").Find(ctx, bson.M{})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch contacts")
		return
	}
	defer cursor.Close(ctx)

	var contacts []models.Contact
	if err = cursor.All(ctx, &contacts); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode contacts")
		return
	}

	c.JSON(http.StatusOK, contacts)
}

func CreateContact(c *gin.Context) {
	var contact models.Contact
	if err := c.ShouldBindJSON(&contact); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}

	contact.ID = primitive.NewObjectID()
	contact.CreatedAt = time.Now()
	contact.LastActivity = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if _, err := db.Collection("contacts").InsertOne(ctx, contact); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create contact")
		return
	}

	c.JSON(http.StatusCreated, contact)
}

var csvHeaders = []string{
	"name", "email", "number", "company", "jobTitle",
	"priority", "companySize", "probability", "status",
}

func ExportContacts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.Collection("contacts").Find(ctx, bson.M{})
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch contacts")
		return
	}
	defer cursor.Close(ctx)

	var contacts []models.Contact
	if err = cursor.All(ctx, &contacts); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode contacts")
		return
	}

	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=contacts.csv")

	w := csv.NewWriter(c.Writer)
	_ = w.Write(csvHeaders)

	for _, ct := range contacts {
		_ = w.Write([]string{
			ct.Name,
			ct.Email,
			ct.Number,
			ct.Company,
			ct.JobTitle,
			ct.Priority,
			strconv.Itoa(ct.CompanySize),
			ct.Probability,
			ct.Status,
		})
	}

	w.Flush()
}

func ImportContacts(c *gin.Context) {
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "CSV file is required")
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.TrimLeadingSpace = true

	rows, err := reader.ReadAll()
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Failed to parse CSV")
		return
	}
	if len(rows) < 2 {
		utils.Err(c, http.StatusBadRequest, "CSV has no data rows")
		return
	}

	// Build column index from header row so order doesn't matter.
	header := rows[0]
	idx := make(map[string]int, len(header))
	for i, h := range header {
		idx[strings.ToLower(strings.TrimSpace(h))] = i
	}

	col := func(row []string, key string) string {
		i, ok := idx[key]
		if !ok || i >= len(row) {
			return ""
		}
		return strings.TrimSpace(row[i])
	}

	var docs []interface{}
	var skipped []string

	for rowNum, row := range rows[1:] {
		name := col(row, "name")
		if name == "" {
			skipped = append(skipped, fmt.Sprintf("row %d: missing name", rowNum+2))
			continue
		}

		size, _ := strconv.Atoi(col(row, "companysize"))

		contact := models.Contact{
			ID:           primitive.NewObjectID(),
			Name:         name,
			Email:        col(row, "email"),
			Number:       col(row, "number"),
			Company:      col(row, "company"),
			JobTitle:     col(row, "jobtitle"),
			Priority:     col(row, "priority"),
			CompanySize:  size,
			Probability:  col(row, "probability"),
			Status:       col(row, "status"),
			LastActivity: time.Now(),
			CreatedAt:    time.Now(),
		}
		docs = append(docs, contact)
	}

	if len(docs) == 0 {
		utils.Err(c, http.StatusBadRequest, "No valid rows to import")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	res, err := db.Collection("contacts").InsertMany(ctx, docs)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to import contacts")
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"imported": len(res.InsertedIDs),
		"skipped":  skipped,
	})
}
