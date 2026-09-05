# Mini-Trello Kanban Board — Project Report

## 1. Student Details

| Field          | Value                                             |
| -------------- | ------------------------------------------------- |
| **Name**       | *Mohit Oza*                                       |
| **Enrollment** | *7IT-08* (Enrollment / Roll Number)               |
| **Semester**   | 7th Semester                                      |
| **Course**     | Software Engineering / Web Development Project    |
| **Project**    | Mini-Trello — Single-Page Kanban Board            |

> ✏️ Replace the Enrollment Number with your actual one before submission.

---

## 2. Project Overview

Mini-Trello is a full-stack, single-page Kanban board that lets users create
tasks and move them across three columns — **To Do → In Progress → Done**. It is
a practical application of:

- **Frontend development** — React (Vite) with a custom, hand-coded UI
- **Backend API creation** — Node.js / Express (RESTful)
- **Database management** — MongoDB (Mongoose ODM)
- **Agile / Scrum methodology** — executed in two 1-week sprints

The UI follows a light, editorial "product" design system (neutral surfaces,
subtle borders, and status-coded colors) with micro-interactions: hover lifts,
drag-and-drop, animated modals, and toast notifications.

---

## 3. Screenshots

> 📸 **Replace with your own high-resolution screenshots.**

### 3.1 Header / Topbar
*Add screenshot showing the "Mini-Trello" brand + "Create new task" button here.*

![Header](placeholders/header.png)

### 3.2 Create-Task Modal
*Add screenshot of the animated modal form (Title + Description + Assigned to).*

![Task Modal](placeholders/modal.png)

### 3.3 Board — 3-Column Layout with active cards
*Add screenshot of the full board: To Do, In Progress, Done with cards.*

![Board](placeholders/board.png)

---

## 4. Agile Execution Summary

### Methodology: Scrum — two 1-week sprints

#### Sprint 1 — Foundation & Setup
| Ceremony / Activity | Details |
| ------------------- | ------- |
| Sprint Planning     | Split work into user stories, estimated story points (Fibonacci). |
| Database Setup      | Designed the `tasks` schema (title, description, status, assigned_to). |
| Backend API         | Created **Create + Read** routes: `GET /api/tasks`, `POST /api/tasks`. |
| Frontend Layout     | Built static HTML/CSS skeleton with the 3-column structure. |

**Sprint 1 Review Deliverable:** Working database, Postman-testable GET/POST
endpoints, static 3-column frontend.

| User Story | Points | Status |
| ---------- | :----: | :----: |
| Create a new task (US1) | 5 | ✅ Done |
| See all tasks grouped by status (US2) | 8 | ✅ Done |

#### Sprint 2 — Integration & Delivery
| Ceremony / Activity | Details |
| ------------------- | ------- |
| Sprint 1 Retrospective | Review: keep clean separation of routes; improve card styling. |
| Sprint 2 Planning     | Pulled remaining stories: move + delete. |
| Backend API           | Completed **Update + Delete**: `PATCH /api/tasks/:id`, `PATCH /api/tasks/:id/move`, `DELETE /api/tasks/:id`. |
| Frontend Integration  | Connected UI to the API with `fetch`; optimistic updates for instant feedback. |
| Interactivity         | Next/Previous buttons **and** drag-and-drop both persist to MongoDB. |

**Sprint 2 Review Deliverable:** Fully functional board where UI actions persist
in the database.

| User Story | Points | Status |
| ---------- | :----: | :----: |
| Move a task To Do → In Progress → Done (US3) | 8 | ✅ Done |
| Delete a task (US4) | 3 | ✅ Done |

### Product Backlog (final)
| Priority | User Story | Story Points |
| -------- | ---------- | :----------: |
| High     | Create a new task            | 5  |
| High     | See tasks grouped by status  | 8  |
| High     | Move task between columns    | 8  |
| Medium   | Delete a task                | 3  |

### Team Responsibility Breakdown
*(Adjust roles to your actual team.)*
| Member         | Role / Responsibility |
| -------------- | --------------------- |
| Mohit Oza      | Full-stack dev, UI design system, integration, deployment |
| *Member 2*      | Backend API + DB schema |
| *Member 3*      | Frontend components + testing |

---

## 5. API Endpoints Table

Base URL: `http://localhost:5000` (local) or your deployed URL.

| Method | Endpoint                 | Description                               | Request Body |
| ------ | ------------------------ | ----------------------------------------- | ------------ |
| GET    | `/api/tasks`             | Fetch all tasks                           | — |
| GET    | `/api/tasks/:id`         | Fetch a single task                       | — |
| POST   | `/api/tasks`             | Create a task (default status: `todo`)    | `{ title, description, assigned_to? }` |
| PATCH  | `/api/tasks/:id`         | Update fields (e.g. `status`)             | `{ status }` or `{ title }` etc. |
| PATCH  | `/api/tasks/:id/move`    | Move one step (`next` / `prev`)           | `{ direction: "next" \| "prev" }` |
| DELETE | `/api/tasks/:id`         | Delete a task                             | — |

### Sample Request — POST /api/tasks
```json
// Request
POST /api/tasks
Content-Type: application/json
{
  "title": "Design Database Schema",
  "description": "Create ER diagram for the task tables.",
  "assigned_to": "Sarah"
}
```
```json
// Response (201 Created)
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f708192021",
    "title": "Design Database Schema",
    "description": "Create ER diagram for the task tables.",
    "status": "todo",
    "assigned_to": "Sarah",
    "createdAt": "2026-09-03T10:00:00.000Z",
    "updatedAt": "2026-09-03T10:00:00.000Z"
  }
}
```

### Sample Request — PATCH /api/tasks/:id/move
```json
// Request
PATCH /api/tasks/64f1a2b3c4d5e6f708192021/move
{ "direction": "next" }
```
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f708192021",
    "title": "Design Database Schema",
    "description": "Create ER diagram for the task tables.",
    "status": "in_progress",
    "assigned_to": "Sarah",
    "createdAt": "2026-09-03T10:00:00.000Z",
    "updatedAt": "2026-09-03T10:05:00.000Z"
  }
}
```

### Sample Request — DELETE /api/tasks/:id
```json
// Request
DELETE /api/tasks/64f1a2b3c4d5e6f708192021

// Response (200 OK)
{ "success": true, "message": "Task deleted." }
```

---

## 6. Task Data Model (MongoDB)

| Field          | Type   | Notes                                    |
| -------------- | ------ | ---------------------------------------- |
| `title`        | String | Required                                 |
| `description`  | String | Required                                 |
| `status`       | String | `todo` \| `in_progress` \| `done` (default `todo`) |
| `assigned_to`  | String | Optional team member                     |
| `createdAt`    | Date   | Auto (timestamps)                        |
| `updatedAt`    | Date   | Auto (timestamps)                        |

---

## 7. Deployment

The app is configured to deploy to **Vercel** as a single serverless app
(Express backend serves the built React frontend). See `README.md` →
**Deploy to Vercel** for step-by-step instructions (MongoDB Atlas + Vercel).

Deployed URL: *[https://your-project.vercel.app]()*

---

**Prepared by Mohit Oza · 7IT-08 · 7th Semester**
