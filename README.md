# Mini-Trello · Kanban Board

A full-stack, single-page **Kanban board** where users create tasks and move them
through three columns — **To Do → In Progress → Done**.

Built as a 7th-semester Agile (Scrum) project with a premium, glassmorphic UI
inspired by modern design systems (Aceternity / Magic UI style effects hand-coded
in plain CSS).

🔗 **Live demo:** [https://minitrello-six.vercel.app/](https://minitrello-six.vercel.app/)

## ✨ Features

- **Create tasks** via an animated modal form (Title + Description required)
- **Three columns** — To Do, In Progress, Done — with glass cards
- **Move tasks** with **Next / Previous buttons** *or* **drag-and-drop**
- **Delete tasks** with a confirmation dialog
- **Optimistic UI** — the board updates instantly, then persists to the DB
- **Premium design**: animated aurora background, glassmorphism, 3D tilt cards,
  cursor spotlight, glowing buttons, animated modals, toasts, and responsive layout

## 🧱 Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React (Vite) + plain CSS            |
| Backend    | Node.js + Express (RESTful API)     |
| Database   | Supabase (PostgreSQL)               |

## 🗂 Project Structure

```
mini-trello/
├── backend/
│   ├── db/supabase.js          # Supabase client (URL + service role key)
│   ├── routes/tasks.js         # REST endpoints
│   ├── scripts/setup-db.js     # one-time: creates table + seed
│   ├── supabase/schema.sql     # SQL schema + seed demo tasks
│   ├── server.js               # Express app
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx           # Board state, drag/drop, optimistic updates
    │   ├── api.js            # fetch helpers
    │   ├── styles.css        # premium design system
    │   └── components/       # Header, Column, TaskCard, Modal, Confirm, Toast, Footer
    ├── index.html
    ├── vite.config.js        # proxies /api -> backend
    └── package.json
```

## 📦 API Endpoints

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| GET    | `/api/tasks`                | Fetch all tasks                   |
| POST   | `/api/tasks`                | Create a task (defaults to todo)  |
| PATCH  | `/api/tasks/:id`            | Update task fields (e.g. status)  |
| PATCH  | `/api/tasks/:id/move`       | Move task `{ direction: 'next'|'prev' }` |
| DELETE | `/api/tasks/:id`            | Delete a task                     |

### Task object
```json
{
  "id": "7f6595e2-2440-4676-aabc-201c0399abb4",
  "title": "Design Database Schema",
  "description": "Create ER diagram for the task tables.",
  "status": "in_progress",
  "assigned_to": "Mohit",
  "createdAt": "2026-09-05T10:41:06.288Z",
  "updatedAt": "2026-09-05T10:41:06.288Z"
}
```

## 🚀 Running Locally

### Prerequisites
- **Node.js** (v18+)
- A free **Supabase** project (PostgreSQL hosting — URL + service role key).

### 1. Set up Supabase
1. Create a free project at https://supabase.com.
2. Open **Supabase Dashboard → SQL Editor**, paste the contents of
   `backend/supabase/schema.sql` and click **Run**. This creates the `tasks`
   table and inserts 3 demo tasks.
   (Or run `npm run setup-db` in `backend/` after filling `.env`.)
3. Copy your project URL and **service role key** from
   **Project Settings → Data API**.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env
```
Edit `.env` and set:
- `SUPABASE_URL` = your project URL (e.g. `https://xxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` = your service role key
- `SUPABASE_DB_URL` = Postgres connection string (only needed for `npm run setup-db`)

Then start the server:
```bash
npm run dev              # starts on http://localhost:5000
```
`server.js` reads `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `PORT` from `.env`.

### 3. Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173
```
Open **http://localhost:5173** in your browser. The Vite dev server proxies
`/api` requests to the backend on port `5000`.

> Test the API with Postman at `http://localhost:5000/api/tasks`.

## 🛠 Building for production
```bash
cd frontend && npm run build   # outputs to frontend/dist
```

For a quick local full-app preview, you can also run `node server.js` in
`backend/` — in development it serves the built `frontend/dist` and the API
from a single server.

## ☁️ Deploy to Vercel (Monorepo — two services)

This repo is configured as a Vercel **monorepo** with two services (see the
root `vercel.json`):

| Service   | Root      | Framework | URL path          |
| --------- | --------- | --------- | ----------------- |
| `frontend`| `frontend`| Vite      | `/` (everything)  |
| `backend` | `backend` | Node      | `/api/*`          |

Rewrites route `/api/*` to the backend service and all other requests to the
frontend service, so the app still lives on a single domain.

### 1. Prepare Supabase
1. Create a free project at https://supabase.com.
2. Run `backend/supabase/schema.sql` once in the **SQL Editor** (this creates the
   `tasks` table and seeds 3 demo tasks). You can re-run it anytime to reset.
3. Copy the **project URL** and **service role key** from
   **Project Settings → Data API**.

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to https://vercel.com → **Add New Project** → import your GitHub repo.
2. Vercel reads the root `vercel.json` and detects the two services (`frontend`
   + `backend`). No root directory override needed.
3. Add these **Environment Variables** for the backend service:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key
4. Click **Deploy**.

Configuration notes:
- Root `vercel.json` declares services + rewrites (`/api/*` → backend,
  `*(.*)` → frontend).
- `backend/server.js` exports the Express app as a Node serverless handler.
- `frontend/vite.config.js` uses relative asset paths (`base: './'`).
- The app auto-redeploys whenever you push to GitHub.

Your app will be live at `https://<project>.vercel.app`.

> **Security:** never commit real credentials. `SUPABASE_SERVICE_ROLE_KEY` is set
> only as a Vercel env var; `.env`, `node_modules`, and `dist` are git-ignored.

---

**Made with ❤️ by Mohit Oza · 7IT-08 · 7th Semester**
