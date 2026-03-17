// Seed script — populates the database with demo data for development.
//
// Usage (from the backend/ directory):
//
//	go run ./cmd/seed
//
// Safe to run multiple times — skips if "Acme Corp" already exists.
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"easycrm/config"
	"easycrm/db"
	"easycrm/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	config.Load()
	db.Connect()

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// ── Guard ─────────────────────────────────────────────────────────────────
	var existing models.Company
	if err := db.Collection("companies").FindOne(ctx, bson.M{"name": "Acme Corp"}).Decode(&existing); err == nil {
		log.Println("Demo data already seeded — skipping.")
		return
	}

	now := time.Now()

	// ── Company ───────────────────────────────────────────────────────────────
	companyID := primitive.NewObjectID()

	// ── Users ─────────────────────────────────────────────────────────────────
	hash := func(p string) string {
		h, _ := bcrypt.GenerateFromPassword([]byte(p), 10)
		return string(h)
	}

	adminID := primitive.NewObjectID()
	users := []interface{}{
		models.User{
			ID:          adminID,
			Name:        "Alice Admin",
			Email:       "admin@acme.com",
			Password:    hash("admin123"),
			Role:        "admin",
			Permissions: []string{"contacts.read", "contacts.write", "users.read", "users.write", "tickets.read", "tickets.write", "projects.read", "projects.write"},
			Verified:    true,
			Date:        now,
			CompanyID:   companyID.Hex(),
			Company:     "Acme Corp",
		},
		models.User{
			ID:          primitive.NewObjectID(),
			Name:        "Mark Manager",
			Email:       "manager@acme.com",
			Password:    hash("admin123"),
			Role:        "manager",
			Permissions: []string{"contacts.read", "contacts.write", "tickets.read", "tickets.write", "projects.read", "projects.write"},
			Verified:    true,
			Date:        now,
			CompanyID:   companyID.Hex(),
			Company:     "Acme Corp",
		},
		models.User{
			ID:          primitive.NewObjectID(),
			Name:        "Sam Support",
			Email:       "support@acme.com",
			Password:    hash("admin123"),
			Role:        "non-admin",
			Permissions: []string{"contacts.read", "tickets.read", "tickets.write"},
			Verified:    true,
			Date:        now,
			CompanyID:   companyID.Hex(),
			Company:     "Acme Corp",
		},
	}

	company := models.Company{
		ID:        companyID,
		Name:      "Acme Corp",
		CreatedBy: adminID.Hex(),
		Number:    "+1 555 000 1234",
		Date:      now,
	}

	must(db.Collection("companies").InsertOne(ctx, company))
	mustMany(db.Collection("users").InsertMany(ctx, users))

	// ── Contacts ──────────────────────────────────────────────────────────────
	contacts := []interface{}{
		models.Contact{
			ID: primitive.NewObjectID(), Name: "Tom Cruise", Email: "tom@globex.com",
			Number: "+1 555 100 0001", Company: "Globex", JobTitle: "CEO",
			Priority: "high", Status: "qualified", Probability: "0.8",
			LastActivity: now.AddDate(0, 0, -2), CreatedAt: now.AddDate(0, -1, 0),
		},
		models.Contact{
			ID: primitive.NewObjectID(), Name: "Jane Foster", Email: "jane@initech.com",
			Number: "+1 555 100 0002", Company: "Initech", JobTitle: "VP Engineering",
			Priority: "medium", Status: "new", Probability: "0.4",
			LastActivity: now.AddDate(0, 0, -5), CreatedAt: now.AddDate(0, -2, 0),
		},
		models.Contact{
			ID: primitive.NewObjectID(), Name: "Bruce Banner", Email: "bruce@umbrella.com",
			Number: "+1 555 100 0003", Company: "Umbrella Corp", JobTitle: "Research Lead",
			Priority: "high", Status: "openDeal", Probability: "0.9",
			LastActivity: now.AddDate(0, 0, -1), CreatedAt: now.AddDate(0, -3, 0),
		},
		models.Contact{
			ID: primitive.NewObjectID(), Name: "Diana Prince", Email: "diana@waynetech.com",
			Number: "+1 555 100 0004", Company: "Wayne Tech", JobTitle: "CTO",
			Priority: "veryHigh", Status: "connected", Probability: "0.6",
			LastActivity: now, CreatedAt: now.AddDate(0, -1, -15),
		},
		models.Contact{
			ID: primitive.NewObjectID(), Name: "Peter Parker", Email: "peter@dailybugle.com",
			Number: "+1 555 100 0005", Company: "Daily Bugle", JobTitle: "Journalist",
			Priority: "low", Status: "attempted", Probability: "0.2",
			LastActivity: now.AddDate(0, 0, -10), CreatedAt: now.AddDate(0, -4, 0),
		},
		models.Contact{
			ID: primitive.NewObjectID(), Name: "Natasha Romanoff", Email: "nat@shield.org",
			Number: "+1 555 100 0006", Company: "S.H.I.E.L.D", JobTitle: "Director",
			Priority: "veryHigh", Status: "won", Probability: "1.0",
			LastActivity: now.AddDate(0, 0, -3), CreatedAt: now.AddDate(0, -5, 0),
		},
	}
	mustMany(db.Collection("contacts").InsertMany(ctx, contacts))

	// ── Tickets ───────────────────────────────────────────────────────────────
	tickets := []interface{}{
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Login page throws 500 on Safari",
			Description: "Users on Safari 17 get a 500 error when submitting the login form.",
			Contact: "Tom Cruise", Email: "tom@globex.com", Category: "bug",
			Priority: "critical", Status: "open", AssignedTo: "Sam Support",
			CreatedAt: now.AddDate(0, 0, -3), UpdatedAt: now.AddDate(0, 0, -3),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Billing invoice not generating",
			Description: "Monthly invoice PDF is empty for accounts created after Nov 2024.",
			Contact: "Bruce Banner", Email: "bruce@umbrella.com", Category: "billing",
			Priority: "high", Status: "inProgress", AssignedTo: "Mark Manager",
			CreatedAt: now.AddDate(0, 0, -7), UpdatedAt: now.AddDate(0, 0, -2),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Export contacts to CSV",
			Description: "Feature request: bulk export of filtered contacts as a CSV file.",
			Contact: "Diana Prince", Email: "diana@waynetech.com", Category: "featureRequest",
			Priority: "medium", Status: "onHold", AssignedTo: "Alice Admin",
			CreatedAt: now.AddDate(0, 0, -14), UpdatedAt: now.AddDate(0, 0, -5),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Password reset email not arriving",
			Description: "Several users report not receiving the reset email. Checked spam folders.",
			Contact: "Jane Foster", Email: "jane@initech.com", Category: "technical",
			Priority: "high", Status: "resolved", AssignedTo: "Sam Support",
			CreatedAt: now.AddDate(0, 0, -10), UpdatedAt: now.AddDate(0, 0, -1),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Add dark mode support",
			Description: "Customer request for dark mode across the dashboard.",
			Contact: "Natasha Romanoff", Email: "nat@shield.org", Category: "featureRequest",
			Priority: "low", Status: "closed", AssignedTo: "Mark Manager",
			CreatedAt: now.AddDate(0, -1, 0), UpdatedAt: now.AddDate(0, 0, -4),
		},
	}
	mustMany(db.Collection("tickets").InsertMany(ctx, tickets))

	// ── Projects + columns + todos ────────────────────────────────────────────
	proj1ID := primitive.NewObjectID()
	proj2ID := primitive.NewObjectID()

	mustMany(db.Collection("projects").InsertMany(ctx, []interface{}{
		models.Project{ID: proj1ID, Name: "Website Redesign", CreatedAt: now.AddDate(0, -1, 0)},
		models.Project{ID: proj2ID, Name: "CRM Onboarding", CreatedAt: now.AddDate(0, 0, -10)},
	}))

	col1Todo, col1Prog, col1Done := primitive.NewObjectID(), primitive.NewObjectID(), primitive.NewObjectID()
	col2Todo, col2Prog, col2Done := primitive.NewObjectID(), primitive.NewObjectID(), primitive.NewObjectID()

	mustMany(db.Collection("columns").InsertMany(ctx, []interface{}{
		models.Column{ID: col1Todo, ProjectID: proj1ID, Name: "Todo", Order: 0, CreatedAt: now},
		models.Column{ID: col1Prog, ProjectID: proj1ID, Name: "In Progress", Order: 1, CreatedAt: now},
		models.Column{ID: col1Done, ProjectID: proj1ID, Name: "Done", Order: 2, CreatedAt: now},
		models.Column{ID: col2Todo, ProjectID: proj2ID, Name: "Todo", Order: 0, CreatedAt: now},
		models.Column{ID: col2Prog, ProjectID: proj2ID, Name: "In Progress", Order: 1, CreatedAt: now},
		models.Column{ID: col2Done, ProjectID: proj2ID, Name: "Done", Order: 2, CreatedAt: now},
	}))

	mustMany(db.Collection("todos").InsertMany(ctx, []interface{}{
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Todo,
			Title: "Create Minimal Logo", Description: "Design a clean logo for the new brand identity.",
			Author: models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, 0, -5),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Todo,
			Title: "Write Homepage Copy", Description: "Craft hero section and feature descriptions.",
			Author: models.TodoAuthor{Name: "Mark Manager", Image: "/static/avatar/002-girl.svg"},
			StatusColor: "#FF9777", CreatedAt: now.AddDate(0, 0, -4),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Prog,
			Title: "Build Component Library", Description: "Set up shadcn/ui components with design tokens.",
			Author: models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, 0, -8),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Prog,
			Title: "Responsive Layout", Description: "Ensure all pages work on mobile and tablet.",
			Author: models.TodoAuthor{Name: "Sam Support", Image: "/static/avatar/005-man-1.svg"},
			StatusColor: "#FF6B93", CreatedAt: now.AddDate(0, 0, -6),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Done,
			Title: "Set Up Vite + Tailwind", Description: "Bootstrap project with Vite, React, and Tailwind CSS.",
			Author: models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, -1, 0),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj2ID, ColumnID: col2Todo,
			Title: "Import Client List", Description: "Upload and map 500 contacts from the old CRM.",
			Author: models.TodoAuthor{Name: "Mark Manager", Image: "/static/avatar/002-girl.svg"},
			StatusColor: "#FF9777", CreatedAt: now.AddDate(0, 0, -3),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj2ID, ColumnID: col2Prog,
			Title: "Configure Email Templates", Description: "Set up welcome and follow-up email sequences.",
			Author: models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, 0, -5),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj2ID, ColumnID: col2Done,
			Title: "Team Training Session", Description: "Onboard 3 team members to the new CRM workflow.",
			Author: models.TodoAuthor{Name: "Sam Support", Image: "/static/avatar/011-man-2.svg"},
			StatusColor: "#A855F7", CreatedAt: now.AddDate(0, 0, -9),
		},
	}))

	fmt.Println("✓ Demo data seeded successfully")
	fmt.Println("")
	fmt.Println("  Company : Acme Corp")
	fmt.Printf("  Users   : %d  (admin@acme.com / manager@acme.com / support@acme.com)\n", len(users))
	fmt.Printf("  Contacts: %d\n", len(contacts))
	fmt.Printf("  Tickets : %d\n", len(tickets))
	fmt.Println("  Projects: 2  (Website Redesign, CRM Onboarding)")
	fmt.Println("")
	fmt.Println("  Password for all accounts: admin123")
}

// ── helpers ───────────────────────────────────────────────────────────────────

func must(result interface{}, err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func mustMany(result interface{}, err error) {
	if err != nil {
		log.Fatal(err)
	}
}
