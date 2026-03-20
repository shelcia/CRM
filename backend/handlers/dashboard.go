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
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DashboardStats struct {
	TotalContacts     int64            `json:"totalContacts"`
	TotalTickets      int64            `json:"totalTickets"`
	OpenTickets       int64            `json:"openTickets"`
	InProgressTickets int64            `json:"inProgressTickets"`
	ResolvedTickets   int64            `json:"resolvedTickets"`
	TotalProjects     int64            `json:"totalProjects"`
	TotalUsers        int64            `json:"totalUsers"`
	RecentContacts    []models.Contact `json:"recentContacts"`
	RecentTickets     []models.Ticket  `json:"recentTickets"`
}

// GET /api/dashboard/stats
func GetDashboardStats(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser, ok := user.(models.User)
	if !ok || currentUser.CompanyID == "" {
		utils.Err(c, http.StatusForbidden, "Forbidden")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	companyIDFilter := bson.M{"companyId": currentUser.CompanyID}

	var stats DashboardStats

	// Contacts (no companyId field on contact documents)
	stats.TotalContacts, _ = db.Collection("contacts").CountDocuments(ctx, bson.M{})

	// Tickets (no companyId field on ticket documents)
	stats.TotalTickets, _ = db.Collection("tickets").CountDocuments(ctx, bson.M{})
	stats.OpenTickets, _ = db.Collection("tickets").CountDocuments(ctx, bson.M{"status": "open"})
	stats.InProgressTickets, _ = db.Collection("tickets").CountDocuments(ctx, bson.M{"status": "inProgress"})
	stats.ResolvedTickets, _ = db.Collection("tickets").CountDocuments(ctx, bson.M{"status": "resolved"})

	// Projects
	stats.TotalProjects, _ = db.Collection("projects").CountDocuments(ctx, bson.M{})

	// Users in same company
	stats.TotalUsers, _ = db.Collection("users").CountDocuments(ctx, companyIDFilter)

	// Recent contacts (last 5, sorted by date desc — Contact.CreatedAt maps to bson:"date")
	contactOpts := options.Find().SetSort(bson.D{{Key: "date", Value: -1}}).SetLimit(5)
	contactCursor, err := db.Collection("contacts").Find(ctx, bson.M{}, contactOpts)
	if err == nil {
		defer contactCursor.Close(ctx)
		contactCursor.All(ctx, &stats.RecentContacts) //nolint
	}
	if stats.RecentContacts == nil {
		stats.RecentContacts = []models.Contact{}
	}

	// Recent tickets (last 5, sorted by createdAt desc)
	ticketOpts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}).SetLimit(5)
	ticketCursor, err := db.Collection("tickets").Find(ctx, bson.M{}, ticketOpts)
	if err == nil {
		defer ticketCursor.Close(ctx)
		ticketCursor.All(ctx, &stats.RecentTickets) //nolint
	}
	if stats.RecentTickets == nil {
		stats.RecentTickets = []models.Ticket{}
	}

	c.JSON(http.StatusOK, stats)
}
