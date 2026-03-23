package handlers

import (
	"context"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"tinycrm/db"
	"tinycrm/models"
	"tinycrm/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// logActivity inserts a system-generated activity note and bumps the contact's lastActivity.
func logActivity(ctx context.Context, contactID primitive.ObjectID, author, body string) {
	note := models.Note{
		ID:        primitive.NewObjectID(),
		ContactID: contactID,
		Type:      models.NoteTypeActivity,
		Body:      body,
		Author:    author,
		CreatedAt: time.Now(),
	}
	db.Collection("contact_notes").InsertOne(ctx, note)
	db.Collection("contacts").UpdateOne(ctx,
		bson.M{"_id": contactID},
		bson.M{"$set": bson.M{"lastActivity": note.CreatedAt}},
	)
}

func getAuthorName(c *gin.Context) string {
	if u, ok := c.Get("user"); ok {
		if user, ok := u.(models.User); ok {
			return user.Name
		}
	}
	return ""
}

func GetContacts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	search           := strings.TrimSpace(c.Query("search"))
	status           := strings.TrimSpace(c.Query("status"))
	priority         := strings.TrimSpace(c.Query("priority"))
	company          := strings.TrimSpace(c.Query("company"))
	contactOwner     := strings.TrimSpace(c.Query("contactOwner"))
	lastActivityFrom := strings.TrimSpace(c.Query("lastActivityFrom"))
	lastActivityTo   := strings.TrimSpace(c.Query("lastActivityTo"))
	dateFrom         := strings.TrimSpace(c.Query("dateFrom"))
	dateTo           := strings.TrimSpace(c.Query("dateTo"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 200 {
		limit = 50
	}

	filter := bson.M{}
	if search != "" {
		filter["$or"] = bson.A{
			bson.M{"name": bson.M{"$regex": search, "$options": "i"}},
			bson.M{"mail": bson.M{"$regex": search, "$options": "i"}},
			bson.M{"company": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if status != "" {
		filter["status"] = status
	}
	if priority != "" {
		filter["priority"] = priority
	}
	if company != "" {
		filter["company"] = bson.M{"$regex": company, "$options": "i"}
	}
	if contactOwner != "" {
		filter["contactOwner"] = bson.M{"$regex": contactOwner, "$options": "i"}
	}
	if lastActivityFrom != "" || lastActivityTo != "" {
		r := bson.M{}
		if lastActivityFrom != "" {
			if t, err := time.Parse("2006-01-02", lastActivityFrom); err == nil {
				r["$gte"] = t
			}
		}
		if lastActivityTo != "" {
			if t, err := time.Parse("2006-01-02", lastActivityTo); err == nil {
				r["$lte"] = t.Add(24*time.Hour - time.Second)
			}
		}
		filter["lastActivity"] = r
	}
	if dateFrom != "" || dateTo != "" {
		r := bson.M{}
		if dateFrom != "" {
			if t, err := time.Parse("2006-01-02", dateFrom); err == nil {
				r["$gte"] = t
			}
		}
		if dateTo != "" {
			if t, err := time.Parse("2006-01-02", dateTo); err == nil {
				r["$lte"] = t.Add(24*time.Hour - time.Second)
			}
		}
		filter["date"] = r
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	total, _ := db.Collection("contacts").CountDocuments(ctx, filter)

	opts := options.Find().
		SetSkip(int64((page - 1) * limit)).
		SetLimit(int64(limit)).
		SetSort(bson.D{{Key: "date", Value: -1}})

	cursor, err := db.Collection("contacts").Find(ctx, filter, opts)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch contacts", err)
		return
	}
	defer cursor.Close(ctx)

	contacts := make([]models.Contact, 0)
	if err = cursor.All(ctx, &contacts); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode contacts", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  contacts,
		"total": total,
		"page":  page,
		"limit": limit,
	})
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

	if contact.Email != "" {
		count, _ := db.Collection("contacts").CountDocuments(ctx, bson.M{"mail": contact.Email})
		if count > 0 {
			utils.Err(c, http.StatusConflict, "A contact with this email already exists")
			return
		}
	}

	if _, err := db.Collection("contacts").InsertOne(ctx, contact); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to create contact", err)
		return
	}

	logActivity(ctx, contact.ID, getAuthorName(c), "Contact created")

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
		utils.Err(c, http.StatusInternalServerError, "Failed to fetch contacts", err)
		return
	}
	defer cursor.Close(ctx)

	contacts := make([]models.Contact, 0)
	if err = cursor.All(ctx, &contacts); err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to decode contacts", err)
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
		utils.Err(c, http.StatusBadRequest, "CSV file is required", err)
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.TrimLeadingSpace = true

	rows, err := reader.ReadAll()
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Failed to parse CSV", err)
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

	// Collect non-empty emails from the CSV for duplicate checking
	var csvEmails []string
	for _, row := range rows[1:] {
		if e := col(row, "email"); e != "" {
			csvEmails = append(csvEmails, e)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// Fetch which of those emails already exist in one query
	existingEmails := make(map[string]bool)
	if len(csvEmails) > 0 {
		type emailDoc struct {
			Email string `bson:"mail"`
		}
		cur, err := db.Collection("contacts").Find(ctx, bson.M{"mail": bson.M{"$in": csvEmails}},
			options.Find().SetProjection(bson.M{"mail": 1}))
		if err == nil {
			var existing []emailDoc
			cur.All(ctx, &existing) //nolint
			for _, e := range existing {
				existingEmails[e.Email] = true
			}
		}
	}

	var docs []any
	var skipped []string

	for rowNum, row := range rows[1:] {
		name := col(row, "name")
		if name == "" {
			skipped = append(skipped, fmt.Sprintf("row %d: missing name", rowNum+2))
			continue
		}

		email := col(row, "email")
		if email != "" && existingEmails[email] {
			skipped = append(skipped, fmt.Sprintf("row %d: duplicate email %s", rowNum+2, email))
			continue
		}

		size, _ := strconv.Atoi(col(row, "companysize"))

		contact := models.Contact{
			ID:           primitive.NewObjectID(),
			Name:         name,
			Email:        email,
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

	res, err := db.Collection("contacts").InsertMany(ctx, docs)
	if err != nil {
		utils.Err(c, http.StatusInternalServerError, "Failed to import contacts", err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"imported": len(res.InsertedIDs),
		"skipped":  skipped,
	})
}

func UpdateContact(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid contact ID", err)
		return
	}

	var body bson.M
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Err(c, http.StatusBadRequest, err.Error())
		return
	}
	delete(body, "_id")
	body["lastActivity"] = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Fetch existing contact before update so we can diff fields.
	var existing models.Contact
	db.Collection("contacts").FindOne(ctx, bson.M{"_id": id}).Decode(&existing)

	author := getAuthorName(c)

	strField := func(key string) (string, bool) {
		v, ok := body[key]
		if !ok {
			return "", false
		}
		s, ok := v.(string)
		return s, ok
	}

	if s, ok := strField("status"); ok && s != "" && s != existing.Status {
		logActivity(ctx, id, author, fmt.Sprintf("Status changed from %s to %s", existing.Status, s))
	}
	if p, ok := strField("priority"); ok && p != "" && p != existing.Priority {
		logActivity(ctx, id, author, fmt.Sprintf("Priority changed from %s to %s", existing.Priority, p))
	}
	if n, ok := strField("name"); ok && n != "" && n != existing.Name {
		logActivity(ctx, id, author, fmt.Sprintf("Name updated to %s", n))
	}
	if co, ok := strField("company"); ok && co != "" && co != existing.Company {
		logActivity(ctx, id, author, fmt.Sprintf("Company updated to %s", co))
	}
	if jt, ok := strField("jobTitle"); ok && jt != "" && jt != existing.JobTitle {
		logActivity(ctx, id, author, fmt.Sprintf("Job title updated to %s", jt))
	}
	if a, ok := strField("contactOwner"); ok && a != existing.ContactOwner {
		if existing.ContactOwner == "" {
			logActivity(ctx, id, author, fmt.Sprintf("Assigned to %s", a))
		} else if a == "" {
			logActivity(ctx, id, author, fmt.Sprintf("Unassigned from %s", existing.ContactOwner))
		} else {
			logActivity(ctx, id, author, fmt.Sprintf("Reassigned from %s to %s", existing.ContactOwner, a))
		}
	}

	after := options.After
	var updated models.Contact
	err = db.Collection("contacts").FindOneAndUpdate(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": body},
		&options.FindOneAndUpdateOptions{ReturnDocument: &after},
	).Decode(&updated)
	if err != nil {
		utils.Err(c, http.StatusNotFound, "Contact not found", err)
		return
	}

	c.JSON(http.StatusOK, updated)
}

func DeleteContact(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		utils.Err(c, http.StatusBadRequest, "Invalid contact ID", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Collection("contacts").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil || result.DeletedCount == 0 {
		utils.Err(c, http.StatusNotFound, "Contact not found", err)
		return
	}

	// cascade — delete associated notes
	db.Collection("contact_notes").DeleteMany(ctx, bson.M{"contactId": id})

	c.JSON(http.StatusOK, gin.H{"deleted": id})
}
