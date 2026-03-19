// Package enums is the single source of truth for all constrained string
// values used across the CRM. Adding a value here automatically surfaces it
// to the frontend via GET /api/enums.
package enums

// ── Typed string kinds ────────────────────────────────────────────────────────

type Role string
type ContactStatus string
type ContactPriority string
type TicketStatus string
type TicketPriority string
type EmailTemplateStatus string
type EmailTemplateFrequency string
type Permission string
type DealStage string

// ── User roles ────────────────────────────────────────────────────────────────

const (
	RoleAdmin    Role = "admin"
	RoleManager  Role = "manager"
	RoleNonAdmin Role = "non-admin"
)

var Roles = []Role{RoleAdmin, RoleManager, RoleNonAdmin}

// ── Contact statuses ──────────────────────────────────────────────────────────

const (
	ContactNew       ContactStatus = "new"
	ContactQualified ContactStatus = "qualified"
	ContactOpenDeal  ContactStatus = "openDeal"
	ContactConnected ContactStatus = "connected"
	ContactAttempted ContactStatus = "attempted"
	ContactWon       ContactStatus = "won"
)

var ContactStatuses = []ContactStatus{
	ContactNew, ContactQualified, ContactOpenDeal, ContactConnected, ContactAttempted, ContactWon,
}

// ── Contact priorities ────────────────────────────────────────────────────────

const (
	PriorityLow      ContactPriority = "low"
	PriorityMedium   ContactPriority = "medium"
	PriorityHigh     ContactPriority = "high"
	PriorityVeryHigh ContactPriority = "veryHigh"
)

var ContactPriorities = []ContactPriority{PriorityLow, PriorityMedium, PriorityHigh, PriorityVeryHigh}

// ── Ticket statuses ───────────────────────────────────────────────────────────

const (
	TicketOpen       TicketStatus = "open"
	TicketInProgress TicketStatus = "inProgress"
	TicketOnHold     TicketStatus = "onHold"
	TicketResolved   TicketStatus = "resolved"
	TicketClosed     TicketStatus = "closed"
)

var TicketStatuses = []TicketStatus{
	TicketOpen, TicketInProgress, TicketOnHold, TicketResolved, TicketClosed,
}

// ── Ticket priorities ─────────────────────────────────────────────────────────

const (
	TicketPriorityLow      TicketPriority = "low"
	TicketPriorityMedium   TicketPriority = "medium"
	TicketPriorityHigh     TicketPriority = "high"
	TicketPriorityCritical TicketPriority = "critical"
)

var TicketPriorities = []TicketPriority{
	TicketPriorityLow, TicketPriorityMedium, TicketPriorityHigh, TicketPriorityCritical,
}

// ── Email template statuses ───────────────────────────────────────────────────

const (
	EmailStatusDraft  EmailTemplateStatus = "draft"
	EmailStatusActive EmailTemplateStatus = "active"
	EmailStatusPaused EmailTemplateStatus = "paused"
)

var EmailTemplateStatuses = []EmailTemplateStatus{EmailStatusDraft, EmailStatusActive, EmailStatusPaused}

// ── Email template frequencies ────────────────────────────────────────────────

const (
	EmailFreqOneTime EmailTemplateFrequency = "one-time"
	EmailFreqDaily   EmailTemplateFrequency = "daily"
	EmailFreqWeekly  EmailTemplateFrequency = "weekly"
	EmailFreqMonthly EmailTemplateFrequency = "monthly"
)

var EmailTemplateFrequencies = []EmailTemplateFrequency{
	EmailFreqOneTime, EmailFreqDaily, EmailFreqWeekly, EmailFreqMonthly,
}

// ── Deal stages ───────────────────────────────────────────────────────────────

const (
	DealStageLead        DealStage = "lead"
	DealStageQualified   DealStage = "qualified"
	DealStageProposal    DealStage = "proposal"
	DealStageNegotiation DealStage = "negotiation"
	DealStageWon         DealStage = "won"
	DealStageLost        DealStage = "lost"
)

var DealStages = []DealStage{
	DealStageLead, DealStageQualified, DealStageProposal,
	DealStageNegotiation, DealStageWon, DealStageLost,
}

// ── Permissions ───────────────────────────────────────────────────────────────

const (
	PermContactsRead  Permission = "contacts.read"
	PermContactsWrite Permission = "contacts.write"
	PermUsersRead     Permission = "users.read"
	PermUsersWrite    Permission = "users.write"
	PermTicketsRead   Permission = "tickets.read"
	PermTicketsWrite  Permission = "tickets.write"
	PermProjectsRead  Permission = "projects.read"
	PermProjectsWrite Permission = "projects.write"
)

var Permissions = []Permission{
	PermContactsRead, PermContactsWrite,
	PermUsersRead, PermUsersWrite,
	PermTicketsRead, PermTicketsWrite,
	PermProjectsRead, PermProjectsWrite,
}

// ── EnumsResponse is what GET /api/enums returns ─────────────────────────────

type EnumsResponse struct {
	Roles                    []Role                   `json:"roles"`
	ContactStatuses          []ContactStatus          `json:"contactStatuses"`
	ContactPriorities        []ContactPriority        `json:"contactPriorities"`
	TicketStatuses           []TicketStatus           `json:"ticketStatuses"`
	TicketPriorities         []TicketPriority         `json:"ticketPriorities"`
	EmailTemplateStatuses    []EmailTemplateStatus    `json:"emailTemplateStatuses"`
	EmailTemplateFrequencies []EmailTemplateFrequency `json:"emailTemplateFrequencies"`
	Permissions              []Permission             `json:"permissions"`
	DealStages               []DealStage              `json:"dealStages"`
}

// All returns the full payload for the /api/enums endpoint.
func All() EnumsResponse {
	return EnumsResponse{
		Roles:                    Roles,
		ContactStatuses:          ContactStatuses,
		ContactPriorities:        ContactPriorities,
		TicketStatuses:           TicketStatuses,
		TicketPriorities:         TicketPriorities,
		EmailTemplateStatuses:    EmailTemplateStatuses,
		EmailTemplateFrequencies: EmailTemplateFrequencies,
		Permissions:              Permissions,
		DealStages:               DealStages,
	}
}
