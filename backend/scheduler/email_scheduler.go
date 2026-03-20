package scheduler

import (
	"context"
	"log"
	"strings"
	"time"

	"tinycrm/db"
	"tinycrm/models"
	"tinycrm/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Start launches the email scheduler goroutine. It ticks every minute and
// fires any active email templates whose scheduled time matches now.
func Start() {
	go run()
}

func run() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()
	log.Println("Email scheduler started")
	for range ticker.C {
		processTemplates()
	}
}

func processTemplates() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	now := time.Now()
	today := now.Format("2006-01-02")
	currentTime := now.Format("15:04")
	currentWeekday := strings.ToLower(now.Weekday().String()) // e.g. "monday"
	currentDay := now.Format("2")                             // day of month without leading zero

	cursor, err := db.Collection("email_templates").Find(ctx, bson.M{"status": "active"})
	if err != nil {
		log.Printf("Scheduler: failed to fetch templates: %v", err)
		return
	}
	defer cursor.Close(ctx)

	var templates []models.EmailTemplate
	if err := cursor.All(ctx, &templates); err != nil {
		log.Printf("Scheduler: failed to decode templates: %v", err)
		return
	}

	for _, t := range templates {
		if !isDue(t, today, currentTime, currentWeekday, currentDay) {
			continue
		}

		recipients := resolveRecipients(ctx, t.Recipient)
		if len(recipients) == 0 {
			log.Printf("Scheduler: template %q has no resolvable recipients", t.Name)
			continue
		}

		for _, r := range recipients {
			rec := r // capture for goroutine
			go func() {
				subject := renderVars(t.Subject, rec.name, rec.email, today)
				body := renderVars(t.Body, rec.name, rec.email, today)
				utils.SendEmail(rec.email, subject, body)
				log.Printf("Scheduler: sent %q to %s", t.Name, rec.email)
			}()
		}

		// Mark one-time templates as sent so they don't fire again
		if t.Frequency == "one-time" {
			_, err := db.Collection("email_templates").UpdateOne(ctx,
				bson.M{"_id": t.ID},
				bson.M{"$set": bson.M{"status": "sent", "updatedAt": time.Now()}},
			)
			if err != nil {
				log.Printf("Scheduler: failed to mark template %q as sent: %v", t.Name, err)
			}
		}
	}
}

func isDue(t models.EmailTemplate, today, currentTime, currentWeekday, currentDay string) bool {
	if t.SendTime != currentTime {
		return false
	}
	switch t.Frequency {
	case "one-time":
		return t.SendDate == today
	case "daily":
		return true
	case "weekly":
		return strings.ToLower(t.DayOfWeek) == currentWeekday
	case "monthly":
		return t.DayOfMonth == currentDay
	}
	return false
}

type recipient struct {
	name  string
	email string
}

// resolveRecipients resolves a template's Recipient field to a list of
// {name, email} pairs. If the value matches an email group name, it expands
// the group's contacts. Otherwise it treats it as comma-separated email
// addresses.
func resolveRecipients(ctx context.Context, value string) []recipient {
	// Try to match an email group by name
	var group models.EmailGroup
	err := db.Collection("email_groups").FindOne(ctx, bson.M{"name": value}).Decode(&group)
	if err == nil && len(group.ContactIDs) > 0 {
		return recipientsFromGroup(ctx, group.ContactIDs)
	}

	// Treat as comma-separated email addresses
	var out []recipient
	for _, raw := range strings.Split(value, ",") {
		email := strings.TrimSpace(raw)
		if email != "" {
			out = append(out, recipient{name: "", email: email})
		}
	}
	return out
}

func recipientsFromGroup(ctx context.Context, contactIDs []string) []recipient {
	var ids []primitive.ObjectID
	for _, sid := range contactIDs {
		oid, err := primitive.ObjectIDFromHex(sid)
		if err == nil {
			ids = append(ids, oid)
		}
	}
	if len(ids) == 0 {
		return nil
	}

	cursor, err := db.Collection("contacts").Find(ctx, bson.M{"_id": bson.M{"$in": ids}})
	if err != nil {
		log.Printf("Scheduler: failed to fetch group contacts: %v", err)
		return nil
	}
	defer cursor.Close(ctx)

	var contacts []models.Contact
	if err := cursor.All(ctx, &contacts); err != nil {
		return nil
	}

	var out []recipient
	for _, c := range contacts {
		if c.Email != "" {
			out = append(out, recipient{name: c.Name, email: c.Email})
		}
	}
	return out
}

func renderVars(s, name, email, date string) string {
	s = strings.ReplaceAll(s, "{{name}}", name)
	s = strings.ReplaceAll(s, "{{email}}", email)
	s = strings.ReplaceAll(s, "{{date}}", date)
	return s
}
