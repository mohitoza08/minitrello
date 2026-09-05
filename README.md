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
| Database   | MongoDB (Mongoose ODM)              |

## 🗂 Project Structure

```
mini-trello/
├── backend/
│   ├── models/Task.js        # Mongoose schema
│   ├── routes/tasks.js       # REST endpoints
│   ├── server.js             # Express app + DB connection
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
  "id": "64f1a2b3c4d5e6f708192021",
  "title": "Design Database Schema",
  "description": "Create ER diagram for the task tables.",
  "status": "in_progress",
  "assigned_to": "Mohit",
  "createdAt": "2026-09-03T10:00:00.000Z",
  "updatedAt": "2026-09-03T10:05:00.000Z"
}
```

## 🚀 Running Locally

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** — running locally, **or** a MongoDB Atlas connection string.

### 1. Start MongoDB
Local install: make sure `mongod` is running (default port `27017`).
> No local MongoDB? Use Docker: `docker run -d -p 27017:27017 mongo:7`
> Or use **MongoDB Atlas** and set the URI in `.env`.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # starts on http://localhost:5000
```
`server.js` reads `MONGODB_URI` and `PORT` from `.env`.
Defaults: `mongodb://127.0.0.1:27017/minitrello` on port `5000`.

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

### 1. MongoDB Atlas (free)
1. Create a free **M0 cluster** at https://cloud.mongodb.com.
2. Create a **database user** (user + password).
3. **Network Access → Add IP → Allow access from anywhere (`0.0.0.0/0`)**.
4. Copy the connection string, e.g.:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/minitrello`

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
3. Add an **Environment Variable** for the backend service:
   - `MONGODB_URI` = your Atlas connection string (with `/minitrello` at the end)
4. Click **Deploy**.

Configuration notes:
- Root `vercel.json` declares services + rewrites (`/api/*` → backend,
  `*(.*)` → frontend).
- `backend/server.js` exports the Express app as a Node serverless handler.
- `frontend/vite.config.js` uses relative asset paths (`base: './'`).
- The app auto-redeploys whenever you push to GitHub.

Your app will be live at `https://<project>.vercel.app`.

> **Security:** never commit real credentials. `MONGODB_URI` is set only as a
> Vercel env var; `.env`, `node_modules`, and `dist` are git-ignored.

---

**Made with ❤️ by Mohit Oza · 7IT-08 · 7th Semester**
