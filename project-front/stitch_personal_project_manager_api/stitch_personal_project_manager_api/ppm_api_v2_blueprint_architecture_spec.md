# Personal Project Manager API (v2) — Blueprint & Architecture Specification

Below is the complete architectural blueprint and technical proposal for building the **Personal Project Manager API** under `src/v2`.

## 1. System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                      Swagger UI                         │
│                    (/api/docs)                          │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                  Controllers (REST API)                 │
│         (ValidationPipe, Transform, DTO Specs)          │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    Services (Logic)                     │
│    (Business Validation, Activity Logger, Progress)     │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                 Repositories / TypeORM                  │
│            (TypeORM Entity Managers & Query)            │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                 PostgreSQL Database                     │
└─────────────────────────────────────────────────────────┘
```

### Core Architecture Highlights
- **Zero Authentication**: Single-user personal workflow tracking.
- **Dynamic Progress & Overdue Metrics**: Computed via QueryBuilder/raw SQL aggregations — no redundant stored columns.
- **Swagger First**: Configured in `main.ts` exposing interactive docs at `/api/docs`.
- **Global Pipes & Interceptors**:
  - `ValidationPipe({ whitelist: true, transform: true })`
  - Global `HttpExceptionFilter` for clean response structures (`{ statusCode, message, error }`).
  - Standardized Response Wrapper (`{ data, meta }`).

---

## 2. Database ERD & Entity Relationships
- **projects** `1 ─── *` **features** (`ON DELETE CASCADE`)
- **projects** `1 ─── *` **tasks** (`ON DELETE CASCADE`)
- **features** `1 ─── *` **tasks** (`ON DELETE SET NULL`)
- **projects / features / tasks** `1 ─── *` **activities** (`project_id: CASCADE`, `feature_id: SET NULL`, `task_id: SET NULL`)

---

## 3. API Endpoints Overview
- **Projects**: `/api/v2/projects` (CRUD, Paginated list, single project stats)
- **Features**: `/api/v2/projects/:projectId/features` & `/api/v2/features/:id`
- **Tasks**: `/api/v2/projects/:projectId/tasks` & `/api/v2/tasks/:id` & `/api/v2/tasks/:id/status`
- **Activities**: `/api/v2/projects/:projectId/activities` (Audit trail log)
- **Dashboard**: `/api/v2/dashboard` (Metrics, overdue counts, active progress, today's tasks)

---

## 4. Implementation Phases (1–10)
- **Phase 1**: Initial Setup & Swagger Integration (`/api/docs`)
- **Phase 2–5**: Core Entities & CRUD (Projects, Features, Tasks, Status transitions)
- **Phase 6–8**: Dynamic Progress Engine, Activity Audit Logs, Dashboard Aggregations
- **Phase 9–10**: Indexing, Pagination, Performance & E2E Testing
