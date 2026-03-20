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
├── components/
│   ├── custom/          # Reusable primitives: CustomTable, CardSection, buttons,
│   │                    #   TableFilters, TableSkeleton, CustomEmptyState, DragHandle
│   ├── common/          # Domain-aware components: StatusBadge, PriorityIndicator,
│   │                    #   AssignedToDisplay, ContactSelect, AuthorAvatar
│   └── ui/              # shadcn/ui base components (Button, Input, Select, Sheet…)
├── hooks/
│   ├── useEnums.ts      # Fetches and caches all enum values from the backend
│   └── usePermissions.ts # Role-based permission checks (has("contacts-edit") etc.)
├── layout/
│   └── admin/           # Dashboard shell (sidebar, topbar, route guard)
├── pages/
│   └── admin/
│       ├── dashboard/   # Stats overview
│       ├── contacts/    # Contact list (server-side search + filters) + add/edit + panel
│       ├── tickets/     # Ticket list (server-side search + filters) + add/edit + panel
│       ├── pipeline/    # Kanban deal board
│       ├── projects/    # Project list + Kanban board with drag-and-drop
│       ├── emails/      # Email templates + email groups CRUD
│       ├── users/       # User list + add/edit forms
│       └── profile/     # Company profile + logo upload
├── services/
│   ├── api.ts           # Axios instance (base URL, auth header injection)
│   ├── apiProvider.ts   # Generic CRUD methods (getAll, getByParams, post, put, remove)
│   └── models/          # Per-resource wrappers (contactsModel, ticketsModel, etc.)
└── utils/
    ├── enumLabel.ts     # toLabel() / toLabelItems() for enum display
    └── confirmToast.ts  # Confirm-before-delete toast helper
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

**Enums** — All dropdown options (roles, statuses, priorities) come from `GET /api/enums` via the `useEnums()` hook. Use `toLabelItems(arr)` to convert them to `{ val, label }` objects for select fields.

**Auth** — JWT is stored in `localStorage` as `CRM-token` and sent on every request via the `auth-token` header, injected automatically by the Axios instance in `api.ts`.

**Permissions** — Use `const { has } = usePermissions()` and `has("contacts-edit")` to conditionally render buttons and routes. Permission keys follow the pattern `<resource>-<action>`.

**API calls** — Use the model files in `src/services/models/` (e.g. `apiContacts.getByParams({ page, limit, search, status })`). Server-side paginated endpoints return `{ data: [], total, page, limit }`.

**Tables** — `CustomTable` supports both client-side and server-side modes. Pass a `serverSide` prop with `total`, `page`, `onPageChange`, `onSearchChange`, and optional `columnFilters` to enable server-driven pagination, search, and inline column filter dropdowns.

**Cards** — Use `<CardSection icon={...} title="...">` for the standard bordered card header + content layout used across detail/form pages.
