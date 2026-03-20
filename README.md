<p align="center">
  <a href="#"><img src="https://capsule-render.vercel.app/api?type=rect&color=4ade80&height=100&section=header&text=Tiny%20CRM&fontSize=50%&fontColor=ffffff" alt="Tiny CRM"></a>
  <h2 align="center">Customer Relationship Management — React + Go</h2>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue?style=for-the-badge">
<img src="https://img.shields.io/badge/Backend-Go-00ADD8?style=for-the-badge">
<img src="https://img.shields.io/badge/UI-shadcn%2Fui%20%2B%20Tailwind-green?style=for-the-badge">
</p>

<p align="center">
<img src="https://img.shields.io/github/stars/shelcia/CRM?style=for-the-badge">
<img src="https://img.shields.io/github/forks/shelcia/CRM?style=for-the-badge">
<img src="https://img.shields.io/github/issues-raw/shelcia/CRM?style=for-the-badge">
</p>

## Introduction

**Tiny CRM** is a full-stack customer relationship management app with role-based access for admins, managers, and employees. Built with a React + TypeScript frontend and a Go backend.

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + shadcn/ui (Radix UI primitives)
- DM Sans Variable font, oklch green/lime palette
- TanStack Table v8, Formik + Yup, React Router v7
- Lucide React icons, react-hot-toast

**Backend**
- Go 1.21 + Gin
- MongoDB via `mongo-driver`
- JWT authentication, AES-256-GCM encryption
- SMTP email (gomail + Gmail) with background scheduler

## Features

| Module            | What it does                                                        |
|-------------------|---------------------------------------------------------------------|
| **Contacts**      | Full CRUD, CSV import/export, notes, server-side search + filters   |
| **Tickets**       | Support ticket tracking with status/priority/category filters       |
| **Pipeline**      | Kanban deal board with stage tracking                               |
| **Projects**      | Kanban project boards with drag-and-drop columns and task cards     |
| **Emails**        | Template builder with scheduling (one-time/daily/weekly/monthly); background goroutine fires emails via Gmail SMTP |
| **Email Groups**  | Group contacts for bulk email campaigns                             |
| **Users**         | Role-based access control (admin / manager / employee)              |
| **Dashboard**     | Stats overview: contacts, tickets, projects, users, recent activity |
| **Company**       | Company profile + logo upload                                       |

## Getting Started

### Docker (recommended)

```bash
cp backend/.env.example backend/.env   # fill in your credentials
docker compose up --build
```

### Manual

```bash
# Backend
cd backend
cp .env.example .env   # fill in DB_CONNECT, EMAIL_ID, EMAIL_PWD, TOKEN_SECRET, CRYPTR_SECRET
go mod download
go run main.go

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Project Structure

```
CRM/
├── docker-compose.yml
├── frontend/              # React 19 + TypeScript + Vite 8
│   └── src/
│       ├── components/    # Reusable UI (CustomTable, CardSection, buttons, etc.)
│       ├── pages/admin/   # Route pages (contacts, tickets, pipeline, projects, emails, users…)
│       ├── hooks/         # useEnums, usePermissions
│       └── services/      # Axios API client + per-resource model wrappers
└── backend/               # Go REST API
    ├── handlers/          # Route handlers (one file per resource)
    ├── models/            # MongoDB models
    ├── middleware/        # JWT auth, rate limiter
    ├── scheduler/         # Background email scheduler (fires templates on schedule)
    ├── templates/         # Transactional email HTML templates
    └── utils/             # SMTP sender, AES crypto helpers
```

## Demo Credentials

After running `go run ./cmd/seed` (or via Docker):

| Role    | Email                | Password |
|---------|----------------------|----------|
| Admin   | admin@acmecorp.com   | admin123 |
| Manager | manager@acmecorp.com | admin123 |
| Member  | member@acmecorp.com  | admin123 |

## Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

- Open an [issue](https://github.com/shelcia/CRM/issues) before starting major work
- Fork the repo and create a branch for your fix or feature
- Submit a pull request with a clear description and screenshots if relevant
- Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing
