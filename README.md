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
- React 18 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui (Radix UI primitives)
- DM Sans Variable font
- TanStack Table, Formik + Yup, React Router v6
- Lucide React icons, react-hot-toast

**Backend**
- Go 1.21
- REST API with JWT authentication
- Email templates (invite, reset password, verification)

## Features

Access is controlled by fine-grained permission scopes:

| Scope             | Description                      |
|-------------------|----------------------------------|
| `contacts.read`   | View contacts                    |
| `contacts.write`  | Create and edit contacts         |
| `tickets.read`    | View tickets                     |
| `tickets.write`   | Create and edit tickets          |
| `projects.read`   | View projects / todos            |
| `projects.write`  | Create and edit projects / todos |
| `users.read`      | View users                       |
| `users.write`     | Invite, edit, and remove users   |

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
go mod download
go run main.go
```

## Project Structure

```
CRM/
├── frontend/          # React + TypeScript + Vite
│   └── src/
│       ├── components/    # Shared components (shadcn/ui wrappers, table, editor)
│       ├── pages/         # Route pages by role (admin, manager, employee)
│       └── lib/           # utils (cn helper)
└── backend/           # Go REST API
    ├── handlers/      # Route handlers
    ├── models/        # Data models
    ├── middleware/    # Auth middleware
    └── templates/    # Email templates
```

## Demo Credentials

| Role      | Email               | Password    |
|-----------|---------------------|-------------|
| admin     | admin@gmail.com     | adminuser   |
| manager   | manager@gmail.com   | manager     |
| non-admin | employee@gmail.com  | employee    |

## Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

- Open an [issue](https://github.com/shelcia/CRM/issues) before starting major work
- Fork the repo and create a branch for your fix or feature
- Submit a pull request with a clear description and screenshots if relevant
- Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing
