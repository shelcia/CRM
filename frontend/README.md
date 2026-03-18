# Tiny CRM — React Frontend

The frontend for Tiny CRM, built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

| Concern           | Library                                                  |
|-------------------|----------------------------------------------------------|
| Framework         | React 19 + TypeScript                                    |
| Build tool        | Vite 8                                                   |
| Styling           | Tailwind CSS v3 + shadcn/ui                              |
| UI primitives     | Radix UI                                                 |
| Routing           | React Router v7                                          |
| Forms             | Formik + Yup                                             |
| HTTP client       | Axios                                                    |
| Drag and drop     | @hello-pangea/dnd                                        |
| Rich text editor  | Lexical                                                  |
| Data tables       | TanStack Table v8                                        |
| Notifications     | react-hot-toast                                          |
| Icons             | lucide-react                                             |
| Font              | DM Sans (variable)                                       |

## Project Structure

```
frontend/src/
├── components/          # Shared UI components (buttons, inputs, table, etc.)
├── hooks/
│   └── useEnums.ts      # Fetches and caches enum values from the backend
├── layout/
│   └── admin/           # Dashboard shell (sidebar, topbar)
├── pages/
│   └── admin/
│       ├── contacts/    # Contact list + add/edit forms
│       ├── tickets/     # Ticket list + add/edit forms
│       ├── todos/       # Projects list + Kanban board
│       ├── users/       # User list + add/edit forms
│       ├── email/       # Email template CRUD
│       └── profile/     # Company profile + logo upload
├── services/
│   ├── api.ts           # Axios instance (base URL, auth header)
│   ├── apiProvider.ts   # Generic CRUD methods (getAll, post, put, remove)
│   └── models/          # Per-resource API wrappers (contactsModel, etc.)
└── utils/
    └── enumLabel.ts     # toLabel() / toLabelItems() for enum display
```

## Setup

1. Make sure the backend is running on port `4050`.

2. Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:4050
```

3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command            | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Start Vite dev server          |
| `npm run build`    | Type-check and build for prod  |
| `npm run preview`  | Preview the production build   |
| `npm run lint`     | Run ESLint                     |
| `npm run type-check` | Run TypeScript without emit  |

## Key Patterns

**Enums** — All dropdown options (roles, statuses, priorities) come from `GET /api/enums` via the `useEnums()` hook. Use `toLabelItems(arr)` to convert them to `{ val, label }` objects for `CustomSelectField`.

**Auth** — JWT is stored in `localStorage` as `CRM-token` and sent on every request via the `auth-token` header, injected automatically by the Axios instance in `api.ts`.

**API calls** — Use the model files in `src/services/models/` (e.g. `contactsModel.getAll()`, `projectsModel.post(data)`). For multipart uploads use `postFormData`.
