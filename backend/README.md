# Tiny CRM — Go Backend

A Go backend for Tiny CRM, built with Gin, MongoDB, and JWT authentication.

## Tech Stack

| Concern          | Library                                           |
|------------------|---------------------------------------------------|
| Web framework    | [Gin](https://github.com/gin-gonic/gin) v1.10     |
| Database         | MongoDB via `mongo-driver` v1.15                  |
| Authentication   | JWT (`golang-jwt/jwt` v5)                         |
| Password hashing | `bcrypt` (golang.org/x/crypto)                    |
| Email            | `gomail.v2` (SMTP)                                |
| Encryption       | AES-256-GCM (stdlib)                              |
| Rate limiting    | `golang.org/x/time/rate`                          |
| Env config       | `godotenv`                                        |

## Project Structure

```
backend/
├── main.go                      # Entry point, router setup
├── config/
│   └── config.go                # .env loader
├── db/
│   └── db.go                    # MongoDB connection
├── enums/
│   └── enums.go                 # Single source of truth for all enum values
├── handlers/
│   ├── auth.go                  # Auth routes (register, login, verify, reset)
│   ├── users.go                 # User CRUD
│   ├── contacts.go              # Contact CRUD + notes + CSV import/export
│   ├── company.go               # Company CRUD + logo upload
│   ├── tickets.go               # Ticket CRUD
│   ├── projects.go              # Project CRUD + board endpoint
│   ├── columns.go               # Kanban column CRUD
│   ├── todos.go                 # Todo CRUD (scoped to project/column)
│   ├── notes.go                 # Contact notes
│   ├── email_templates.go       # Email template CRUD
│   └── enums.go                 # Exposes enums to frontend
├── middleware/
│   ├── auth.go                  # JWT auth-token middleware
│   └── rate_limit.go            # Per-IP rate limiter (160 req/min)
├── models/
│   ├── user.go
│   ├── company.go
│   ├── contact.go
│   ├── note.go
│   ├── ticket.go
│   ├── project.go
│   ├── column.go
│   ├── todo.go
│   └── email_template.go
├── templates/
│   ├── base.go                  # Shared HTML email layout
│   ├── verification.go          # Email verification template
│   ├── reset_password.go        # Password reset template
│   └── invite_user.go           # User invitation template
├── utils/
│   ├── crypto.go                # AES-256-GCM encrypt/decrypt
│   └── email.go                 # SMTP email sender
└── cmd/
    └── seed/
        └── main.go              # Standalone DB seed script
```

## Prerequisites

- Go 1.21+
- MongoDB (local or Atlas)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for SMTP

## Setup

1. Create a `.env` file in `backend/`:

```env
DB_CONNECT=mongodb+srv://<user>:<password>@cluster.mongodb.net/tinycrm
TOKEN_SECRET=<your-jwt-secret>
CRYPTR_SECRET=<your-aes-encryption-secret>
EMAIL_ID=<your-gmail-address>
EMAIL_PWD=<your-gmail-app-password>
FRONTEND_LINK=http://127.0.0.1:5173/
PORT=4050                        # optional, defaults to 4050
SMTP_HOST=smtp.gmail.com         # optional, defaults to smtp.gmail.com
SMTP_PORT=587                    # optional, defaults to 587
```

2. Install dependencies and run:

```bash
go mod download
go run main.go
```

3. (Optional) Seed the database with demo data:

```bash
go run ./cmd/seed
```

## API Endpoints

All authenticated requests require an `auth-token` header containing a valid JWT.

### Auth — `/api/auth`

| Method | Path                      | Description                     | Auth |
|--------|---------------------------|---------------------------------|------|
| POST   | `/register`               | Register user + create company  | No   |
| POST   | `/login`                  | Login, returns JWT in header    | No   |
| PUT    | `/verification/:id`       | Verify email via encrypted link | No   |
| POST   | `/resend`                 | Resend verification email       | No   |
| POST   | `/reset-password`         | Send password reset email       | No   |
| PUT    | `/change-password/:token` | Set new password via reset link | No   |

### Enums — `/api/enums`

| Method | Path | Description                                    | Auth |
|--------|------|------------------------------------------------|------|
| GET    | `/`  | Return all enum values (roles, statuses, etc.) | No   |

### Users — `/api/users`

| Method | Path   | Description                            | Auth |
|--------|--------|----------------------------------------|------|
| GET    | `/`    | List all users in the same company     | Yes  |
| POST   | `/`    | Create a new user (sends invite email) | Yes  |
| GET    | `/:id` | Get a user by ID                       | Yes  |
| PUT    | `/:id` | Update a user                          | Yes  |
| DELETE | `/:id` | Delete a user                          | Yes  |

### Contacts — `/api/contacts`

| Method | Path                    | Description                | Auth |
|--------|-------------------------|----------------------------|------|
| GET    | `/`                     | List all contacts          | Yes  |
| POST   | `/`                     | Create a contact           | Yes  |
| GET    | `/export`               | Export contacts as CSV     | Yes  |
| POST   | `/import`               | Import contacts from CSV   | Yes  |
| GET    | `/:id/notes`            | List notes for a contact   | Yes  |
| POST   | `/:id/notes`            | Add a note to a contact    | Yes  |
| DELETE | `/:id/notes/:noteId`    | Delete a contact note      | Yes  |

### Company — `/api/company`

| Method | Path    | Description                | Auth |
|--------|---------|----------------------------|------|
| GET    | `/`     | Get current user's company | Yes  |
| POST   | `/`     | Create a company           | Yes  |
| PUT    | `/`     | Update company details     | Yes  |
| POST   | `/logo` | Upload company logo        | Yes  |

### Projects — `/api/projects`

| Method | Path                  | Description                                        | Auth |
|--------|-----------------------|----------------------------------------------------|------|
| GET    | `/`                   | List all projects                                  | Yes  |
| POST   | `/`                   | Create a project (auto-creates 3 default columns)  | Yes  |
| PUT    | `/:id`                | Update a project                                   | Yes  |
| DELETE | `/:id`                | Delete a project (cascades to columns and todos)   | Yes  |
| GET    | `/:id/board`          | Get columns with embedded todos (Kanban board)     | Yes  |
| POST   | `/:id/columns`        | Add a column to a project                          | Yes  |
| PUT    | `/:id/columns/:colId` | Update a column                                    | Yes  |
| DELETE | `/:id/columns/:colId` | Delete a column (also deletes its todos)           | Yes  |
| POST   | `/:id/todos`          | Create a todo in a project column                  | Yes  |

### Todos — `/api/todos`

| Method | Path   | Description                         | Auth |
|--------|--------|-------------------------------------|------|
| PUT    | `/:id` | Update a todo (supports column move) | Yes  |
| DELETE | `/:id` | Delete a todo                        | Yes  |

### Tickets — `/api/tickets`

| Method | Path   | Description      | Auth |
|--------|--------|------------------|------|
| GET    | `/`    | List all tickets | Yes  |
| POST   | `/`    | Create a ticket  | Yes  |
| GET    | `/:id` | Get a ticket     | Yes  |
| PUT    | `/:id` | Update a ticket  | Yes  |
| DELETE | `/:id` | Delete a ticket  | Yes  |

### Email Templates — `/api/email-templates`

| Method | Path   | Description               | Auth |
|--------|--------|---------------------------|------|
| GET    | `/`    | List all email templates  | Yes  |
| POST   | `/`    | Create an email template  | Yes  |
| GET    | `/:id` | Get an email template     | Yes  |
| PUT    | `/:id` | Update an email template  | Yes  |
| DELETE | `/:id` | Delete an email template  | Yes  |

## Demo Credentials

After running `go run ./cmd/seed`:

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@acmecorp.com     | admin123   |
| Manager | manager@acmecorp.com   | admin123   |
| Member  | member@acmecorp.com    | admin123   |
