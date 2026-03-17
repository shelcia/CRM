# Easy CRM — Go Backend

A Go rewrite of the Easy CRM backend, built with Gin, MongoDB, and JWT authentication.

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
backend-go/
├── main.go                  # Entry point, router setup
├── config/
│   └── config.go            # .env loader
├── db/
│   └── db.go                # MongoDB connection
├── handlers/
│   ├── auth.go              # Auth routes (register, login, verify, reset)
│   ├── users.go             # User CRUD
│   ├── contacts.go          # Contact CRUD
│   └── company.go           # Company CRUD
├── middleware/
│   ├── auth.go              # JWT auth-token middleware
│   └── rate_limit.go        # Per-IP rate limiter (160 req/min)
├── models/
│   ├── user.go
│   ├── company.go
│   ├── contact.go
│   ├── ticket.go
│   └── service_request.go
├── templates/
│   ├── verification.go      # Email verification HTML template
│   ├── reset_password.go    # Password reset HTML template
│   └── invite_user.go       # User invitation HTML template
└── utils/
    ├── crypto.go            # AES-256-GCM encrypt/decrypt (replaces Cryptr)
    └── email.go             # SMTP email sender (replaces nodemailer)
```

## Prerequisites

- Go 1.21+
- MongoDB (local or Atlas)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for SMTP

## Setup

1. Create a `.env` file in `backend-go/`:

```env
DB_CONNECT=mongodb+srv://<user>:<password>@cluster.mongodb.net/easycrm
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

## API Endpoints

### Auth — `/api/auth`

| Method | Path                      | Description                     | Auth |
|--------|---------------------------|---------------------------------|------|
| POST   | `/register`               | Register user + create company  | No   |
| POST   | `/login`                  | Login, returns JWT in header    | No   |
| PUT    | `/verification/:id`       | Verify email via encrypted link | No   |
| POST   | `/resend`                 | Resend verification email       | No   |
| POST   | `/reset-password`         | Send password reset email       | No   |
| PUT    | `/change-password/:token` | Set new password via reset link | No   |

### Users — `/api/users`

| Method | Path | Description                            | Auth |
|--------|------|----------------------------------------|------|
| GET    | `/`  | List all users in the same company     | Yes  |
| POST   | `/`  | Create a new user (sends invite email) | Yes  |

### Contacts — `/api/contacts`

| Method | Path | Description       | Auth |
|--------|------|-------------------|------|
| GET    | `/`  | List all contacts | Yes  |
| POST   | `/`  | Create a contact  | Yes  |

### Company — `/api/company`

| Method | Path | Description                | Auth |
|--------|------|----------------------------|------|
| GET    | `/`  | Get current user's company | Yes  |
| POST   | `/`  | Create a company           | Yes  |

Authenticated requests require an `auth-token` header containing a valid JWT.

## Demo Credentials

| Role     | Email              | Password |
|----------|--------------------|----------|
| Admin    | admin@gmail.com    | shelcia  |
| Manager  | manager@gmail.com  | manager  |
| Employee | employee@gmail.com | employee |

## Links

- Frontend repo: https://github.com/shelcia/crm-frontend
- Original Node.js backend: https://github.com/shelcia/CRM-backend
- Live demo: https://freee-crm.netlify.app/
