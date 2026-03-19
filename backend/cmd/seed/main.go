// Seed script — wipes all data and re-seeds demo data for development.
//
// Usage (from the backend/ directory):
//
//	go run ./cmd/seed
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"tinycrm/config"
	"tinycrm/db"
	"tinycrm/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	config.Load()
	db.Connect()

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// ── Wipe all collections ──────────────────────────────────────────────────
	collections := []string{"companies", "users", "contacts", "tickets", "projects", "columns", "todos", "contact_notes", "email_templates", "deals", "email_groups"}
	for _, name := range collections {
		if _, err := db.Collection(name).DeleteMany(ctx, bson.M{}); err != nil {
			log.Fatalf("Failed to clear %s: %v", name, err)
		}
	}
	fmt.Println("✓ Cleared existing data")

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
		// Admin — full access
		models.User{
			ID:       adminID,
			Name:     "Alice Admin",
			Email:    "admin@acme.com",
			Password: hash("admin123"),
			Permissions: []string{
				"admin",
				"users-view", "users-edit", "users-delete",
				"contacts-view", "contacts-edit", "contacts-delete",
				"pipeline-view", "pipeline-edit", "pipeline-delete",
				"tickets-view", "tickets-edit", "tickets-delete",
				"projects-view", "projects-edit", "projects-delete",
			},
			Verified:  true,
			Date:      now,
			CompanyID: companyID.Hex(),
			Company:   "Acme Corp",
		},
		// Manager — contacts + pipeline + tickets + projects, no user management
		models.User{
			ID:       primitive.NewObjectID(),
			Name:     "Mark Manager",
			Email:    "manager@acme.com",
			Password: hash("admin123"),
			Permissions: []string{
				"contacts-view", "contacts-edit", "contacts-delete",
				"pipeline-view", "pipeline-edit", "pipeline-delete",
				"tickets-view", "tickets-edit", "tickets-delete",
				"projects-view", "projects-edit", "projects-delete",
			},
			Verified:  true,
			Date:      now,
			CompanyID: companyID.Hex(),
			Company:   "Acme Corp",
		},
		// Support — read contacts + pipeline, manage tickets only
		models.User{
			ID:       primitive.NewObjectID(),
			Name:     "Sam Support",
			Email:    "support@acme.com",
			Password: hash("admin123"),
			Permissions: []string{
				"contacts-view",
				"pipeline-view",
				"tickets-view", "tickets-edit",
			},
			Verified:  true,
			Date:      now,
			CompanyID: companyID.Hex(),
			Company:   "Acme Corp",
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
	tomID := primitive.NewObjectID()
	janeID := primitive.NewObjectID()
	bruceID := primitive.NewObjectID()
	dianaID := primitive.NewObjectID()
	peterID := primitive.NewObjectID()
	natashaID := primitive.NewObjectID()

	contacts := []interface{}{
		models.Contact{
			ID: tomID, Name: "Tom Cruise", Email: "tom@globex.com",
			Number: "+1 555 100 0001", Company: "Globex", JobTitle: "CEO",
			Priority: "high", Status: "qualified", Probability: "0.8",
			LastActivity: now.AddDate(0, 0, -2), CreatedAt: now.AddDate(0, -1, 0),
		},
		models.Contact{
			ID: janeID, Name: "Jane Foster", Email: "jane@initech.com",
			Number: "+1 555 100 0002", Company: "Initech", JobTitle: "VP Engineering",
			Priority: "medium", Status: "new", Probability: "0.4",
			LastActivity: now.AddDate(0, 0, -5), CreatedAt: now.AddDate(0, -2, 0),
		},
		models.Contact{
			ID: bruceID, Name: "Bruce Banner", Email: "bruce@umbrella.com",
			Number: "+1 555 100 0003", Company: "Umbrella Corp", JobTitle: "Research Lead",
			Priority: "high", Status: "openDeal", Probability: "0.9",
			LastActivity: now.AddDate(0, 0, -1), CreatedAt: now.AddDate(0, -3, 0),
		},
		models.Contact{
			ID: dianaID, Name: "Diana Prince", Email: "diana@waynetech.com",
			Number: "+1 555 100 0004", Company: "Wayne Tech", JobTitle: "CTO",
			Priority: "veryHigh", Status: "connected", Probability: "0.6",
			LastActivity: now, CreatedAt: now.AddDate(0, -1, -15),
		},
		models.Contact{
			ID: peterID, Name: "Peter Parker", Email: "peter@dailybugle.com",
			Number: "+1 555 100 0005", Company: "Daily Bugle", JobTitle: "Journalist",
			Priority: "low", Status: "attempted", Probability: "0.2",
			LastActivity: now.AddDate(0, 0, -10), CreatedAt: now.AddDate(0, -4, 0),
		},
		models.Contact{
			ID: natashaID, Name: "Natasha Romanoff", Email: "nat@shield.org",
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
			Contact:     "Tom Cruise", Email: "tom@globex.com", Category: "bug",
			Priority: "critical", Status: "open", AssignedTo: "Sam Support",
			CreatedAt: now.AddDate(0, 0, -3), UpdatedAt: now.AddDate(0, 0, -3),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Billing invoice not generating",
			Description: "Monthly invoice PDF is empty for accounts created after Nov 2024.",
			Contact:     "Bruce Banner", Email: "bruce@umbrella.com", Category: "support",
			Priority: "high", Status: "inProgress", AssignedTo: "Mark Manager",
			CreatedAt: now.AddDate(0, 0, -7), UpdatedAt: now.AddDate(0, 0, -2),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Export contacts to CSV",
			Description: "Feature request: bulk export of filtered contacts as a CSV file.",
			Contact:     "Diana Prince", Email: "diana@waynetech.com", Category: "feature",
			Priority: "medium", Status: "onHold", AssignedTo: "Alice Admin",
			CreatedAt: now.AddDate(0, 0, -14), UpdatedAt: now.AddDate(0, 0, -5),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Password reset email not arriving",
			Description: "Several users report not receiving the reset email. Checked spam folders.",
			Contact:     "Jane Foster", Email: "jane@initech.com", Category: "question",
			Priority: "high", Status: "resolved", AssignedTo: "Sam Support",
			CreatedAt: now.AddDate(0, 0, -10), UpdatedAt: now.AddDate(0, 0, -1),
		},
		models.Ticket{
			ID: primitive.NewObjectID(), Title: "Add dark mode support",
			Description: "Customer request for dark mode across the dashboard.",
			Contact:     "Natasha Romanoff", Email: "nat@shield.org", Category: "feature",
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
			Author:      models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, 0, -5),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Todo,
			Title: "Write Homepage Copy", Description: "Craft hero section and feature descriptions.",
			Author:      models.TodoAuthor{Name: "Mark Manager", Image: "/static/avatar/002-girl.svg"},
			StatusColor: "#FF9777", CreatedAt: now.AddDate(0, 0, -4),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Prog,
			Title: "Build Component Library", Description: "Set up shadcn/ui components with design tokens.",
			Author:      models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, 0, -8),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Prog,
			Title: "Responsive Layout", Description: "Ensure all pages work on mobile and tablet.",
			Author:      models.TodoAuthor{Name: "Sam Support", Image: "/static/avatar/005-man-1.svg"},
			StatusColor: "#FF6B93", CreatedAt: now.AddDate(0, 0, -6),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj1ID, ColumnID: col1Done,
			Title: "Set Up Vite + Tailwind", Description: "Bootstrap project with Vite, React, and Tailwind CSS.",
			Author:      models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, -1, 0),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj2ID, ColumnID: col2Todo,
			Title: "Import Client List", Description: "Upload and map 500 contacts from the old CRM.",
			Author:      models.TodoAuthor{Name: "Mark Manager", Image: "/static/avatar/002-girl.svg"},
			StatusColor: "#FF9777", CreatedAt: now.AddDate(0, 0, -3),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj2ID, ColumnID: col2Prog,
			Title: "Configure Email Templates", Description: "Set up welcome and follow-up email sequences.",
			Author:      models.TodoAuthor{Name: "Alice Admin", Image: "/static/avatar/001-man.svg"},
			StatusColor: "#2499EF", CreatedAt: now.AddDate(0, 0, -5),
		},
		models.Todo{
			ID: primitive.NewObjectID(), ProjectID: proj2ID, ColumnID: col2Done,
			Title: "Team Training Session", Description: "Onboard 3 team members to the new CRM workflow.",
			Author:      models.TodoAuthor{Name: "Sam Support", Image: "/static/avatar/011-man-2.svg"},
			StatusColor: "#A855F7", CreatedAt: now.AddDate(0, 0, -9),
		},
	}))

	// ── Email Templates ───────────────────────────────────────────────────────
	emailTemplates := []interface{}{
		models.EmailTemplate{
			ID:        primitive.NewObjectID(),
			Name:      "Welcome Onboarding",
			Subject:   "Welcome to Acme Corp — let's get started!",
			Body:      "Hi {{name}},\n\nWe're thrilled to have you on board. Here's everything you need to get started with Acme Corp...\n\nBest,\nThe Acme Team",
			Recipient: "new-clients",
			Frequency: "one-time",
			SendDate:  now.AddDate(0, 0, 1).Format("2006-01-02"),
			SendTime:  "09:00",
			Status:    "active",
			CreatedAt: now,
			UpdatedAt: now,
		},
		models.EmailTemplate{
			ID:        primitive.NewObjectID(),
			Name:      "Weekly Newsletter",
			Subject:   "Your weekly update from Acme Corp",
			Body:      "Hi {{name}},\n\nHere's what happened this week at Acme Corp:\n\n• Product updates\n• Industry news\n• Tips & tricks\n\nSee you next week!\nThe Acme Team",
			Recipient: "all-contacts",
			Frequency: "weekly",
			SendTime:  "08:00",
			DayOfWeek: "monday",
			Status:    "active",
			CreatedAt: now.AddDate(0, -1, 0),
			UpdatedAt: now.AddDate(0, -1, 0),
		},
		models.EmailTemplate{
			ID:         primitive.NewObjectID(),
			Name:       "Monthly Check-in",
			Subject:    "Checking in — how can we help?",
			Body:       "Hi {{name}},\n\nIt's been a month since we last connected. We'd love to hear how things are going and see if there's anything we can do to support you.\n\nReply to this email or book a call at your convenience.\n\nCheers,\nAlice Admin",
			Recipient:  "qualified-leads",
			Frequency:  "monthly",
			SendTime:   "10:00",
			DayOfMonth: "1",
			Status:     "active",
			CreatedAt:  now.AddDate(0, -2, 0),
			UpdatedAt:  now.AddDate(0, -2, 0),
		},
		models.EmailTemplate{
			ID:        primitive.NewObjectID(),
			Name:      "Follow-up After Demo",
			Subject:   "Thanks for joining our demo!",
			Body:      "Hi {{name}},\n\nThank you for taking the time to join our product demo. I hope it gave you a clear picture of what Acme Corp can do for your team.\n\nNext steps:\n1. Review the proposal I've attached\n2. Share with your team\n3. Let's schedule a follow-up call\n\nLooking forward to working with you!\nMark Manager",
			Recipient: "demo-attendees",
			Frequency: "one-time",
			SendDate:  now.AddDate(0, 0, 2).Format("2006-01-02"),
			SendTime:  "14:00",
			Status:    "draft",
			CreatedAt: now.AddDate(0, 0, -3),
			UpdatedAt: now.AddDate(0, 0, -1),
		},
		models.EmailTemplate{
			ID:        primitive.NewObjectID(),
			Name:      "Re-engagement Campaign",
			Subject:   "We miss you — here's 20% off",
			Body:      "Hi {{name}},\n\nWe noticed you haven't been active recently and we'd love to win you back.\n\nUse code COMEBACK20 for 20% off your next renewal.\n\nOffer expires in 7 days.\n\nThe Acme Team",
			Recipient: "inactive-contacts",
			Frequency: "one-time",
			SendDate:  now.AddDate(0, 0, 5).Format("2006-01-02"),
			SendTime:  "11:00",
			Status:    "paused",
			CreatedAt: now.AddDate(0, -3, 0),
			UpdatedAt: now.AddDate(0, 0, -7),
		},
	}
	mustMany(db.Collection("email_templates").InsertMany(ctx, emailTemplates))

	// ── Deals (linked to contacts) ────────────────────────────────────────────
	closeIn := func(days int) *time.Time { t := now.AddDate(0, 0, days); return &t }

	deals := []interface{}{
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Globex Enterprise License",
			ContactID: tomID.Hex(), ContactName: "Tom Cruise",
			Value: 48000, Currency: "USD", Stage: "proposal",
			AssignedTo: "Alice Admin", ExpectedClose: closeIn(14),
			CreatedAt: now.AddDate(0, -1, 0), UpdatedAt: now.AddDate(0, 0, -2),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Globex Add-on Seats",
			ContactID: tomID.Hex(), ContactName: "Tom Cruise",
			Value: 8500, Currency: "USD", Stage: "negotiation",
			AssignedTo: "Mark Manager", ExpectedClose: closeIn(7),
			CreatedAt: now.AddDate(0, 0, -10), UpdatedAt: now.AddDate(0, 0, -1),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Initech Pilot Program",
			ContactID: janeID.Hex(), ContactName: "Jane Foster",
			Value: 12000, Currency: "USD", Stage: "lead",
			AssignedTo: "Mark Manager", ExpectedClose: closeIn(30),
			CreatedAt: now.AddDate(0, -2, 0), UpdatedAt: now.AddDate(0, 0, -5),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Umbrella Corp Research Suite",
			ContactID: bruceID.Hex(), ContactName: "Bruce Banner",
			Value: 75000, Currency: "USD", Stage: "negotiation",
			AssignedTo: "Alice Admin", ExpectedClose: closeIn(10),
			CreatedAt: now.AddDate(0, -3, 0), UpdatedAt: now.AddDate(0, 0, -1),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Wayne Tech Platform Deal",
			ContactID: dianaID.Hex(), ContactName: "Diana Prince",
			Value: 120000, Currency: "USD", Stage: "qualified",
			AssignedTo: "Alice Admin", ExpectedClose: closeIn(45),
			CreatedAt: now.AddDate(0, -1, -15), UpdatedAt: now,
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Wayne Tech Pro Support",
			ContactID: dianaID.Hex(), ContactName: "Diana Prince",
			Value: 18000, Currency: "USD", Stage: "proposal",
			AssignedTo: "Mark Manager", ExpectedClose: closeIn(21),
			CreatedAt: now.AddDate(0, 0, -8), UpdatedAt: now.AddDate(0, 0, -2),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Daily Bugle Media Package",
			ContactID: peterID.Hex(), ContactName: "Peter Parker",
			Value: 3200, Currency: "USD", Stage: "lead",
			AssignedTo: "Sam Support", ExpectedClose: closeIn(60),
			CreatedAt: now.AddDate(0, -4, 0), UpdatedAt: now.AddDate(0, 0, -10),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "S.H.I.E.L.D Annual Contract",
			ContactID: natashaID.Hex(), ContactName: "Natasha Romanoff",
			Value: 250000, Currency: "USD", Stage: "won",
			AssignedTo: "Alice Admin", ExpectedClose: closeIn(-5),
			CreatedAt: now.AddDate(0, -5, 0), UpdatedAt: now.AddDate(0, 0, -3),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "S.H.I.E.L.D Security Audit",
			ContactID: natashaID.Hex(), ContactName: "Natasha Romanoff",
			Value: 32000, Currency: "USD", Stage: "won",
			AssignedTo: "Mark Manager", ExpectedClose: closeIn(-15),
			CreatedAt: now.AddDate(0, -6, 0), UpdatedAt: now.AddDate(0, -1, 0),
		},
		models.Deal{
			ID: primitive.NewObjectID(), Title: "Initech Cloud Migration",
			ContactID: janeID.Hex(), ContactName: "Jane Foster",
			Value: 0, Currency: "USD", Stage: "lost",
			AssignedTo: "Sam Support", ExpectedClose: closeIn(-30),
			CreatedAt: now.AddDate(0, -3, 0), UpdatedAt: now.AddDate(0, -1, -5),
		},
	}
	mustMany(db.Collection("deals").InsertMany(ctx, deals))

	// ── Email Groups ──────────────────────────────────────────────────────────
	emailGroups := []interface{}{
		models.EmailGroup{
			ID:          primitive.NewObjectID(),
			Name:        "new-clients",
			Description: "Contacts who recently signed up or onboarded",
			ContactIDs:  []string{tomID.Hex(), janeID.Hex()},
			CreatedAt:   now.AddDate(0, -3, 0),
			UpdatedAt:   now.AddDate(0, -3, 0),
		},
		models.EmailGroup{
			ID:          primitive.NewObjectID(),
			Name:        "all-contacts",
			Description: "Every contact in the CRM",
			ContactIDs:  []string{tomID.Hex(), janeID.Hex(), bruceID.Hex(), dianaID.Hex(), peterID.Hex(), natashaID.Hex()},
			CreatedAt:   now.AddDate(0, -5, 0),
			UpdatedAt:   now.AddDate(0, -5, 0),
		},
		models.EmailGroup{
			ID:          primitive.NewObjectID(),
			Name:        "qualified-leads",
			Description: "Contacts in qualified or openDeal status",
			ContactIDs:  []string{tomID.Hex(), bruceID.Hex()},
			CreatedAt:   now.AddDate(0, -2, 0),
			UpdatedAt:   now.AddDate(0, -2, 0),
		},
		models.EmailGroup{
			ID:          primitive.NewObjectID(),
			Name:        "demo-attendees",
			Description: "Contacts who attended a product demo",
			ContactIDs:  []string{dianaID.Hex(), bruceID.Hex(), janeID.Hex()},
			CreatedAt:   now.AddDate(0, -1, 0),
			UpdatedAt:   now.AddDate(0, -1, 0),
		},
		models.EmailGroup{
			ID:          primitive.NewObjectID(),
			Name:        "inactive-contacts",
			Description: "Contacts with no activity in 30+ days",
			ContactIDs:  []string{peterID.Hex()},
			CreatedAt:   now.AddDate(0, -4, 0),
			UpdatedAt:   now.AddDate(0, -4, 0),
		},
	}
	mustMany(db.Collection("email_groups").InsertMany(ctx, emailGroups))

	fmt.Println("✓ Demo data seeded successfully")
	fmt.Println("")
	fmt.Println("  Company : Acme Corp")
	fmt.Printf("  Users   : %d  (admin@acme.com / manager@acme.com / support@acme.com)\n", len(users))
	fmt.Printf("  Contacts: %d\n", len(contacts))
	fmt.Printf("  Tickets : %d\n", len(tickets))
	fmt.Println("  Projects: 2  (Website Redesign, CRM Onboarding)")
	fmt.Printf("  Email Templates: %d\n", len(emailTemplates))
	fmt.Printf("  Deals   : %d  (linked to contacts)\n", len(deals))
	fmt.Printf("  Email Groups: %d\n", len(emailGroups))
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
