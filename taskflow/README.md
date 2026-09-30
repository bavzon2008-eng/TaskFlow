# TaskFlow – Full-Stack Task Manager

React + Vite frontend, Express API, PostgreSQL database, JWT authentication.

## Features
Sign up / sign in / sign out, protected routes, task CRUD, status + progress with automatic sync
(100% ⇒ Completed, Completed ⇒ 100%, Not Started ⇒ 0%), due dates, overdue detection, filters
(All / Not Started / In Progress / Completed / Overdue), search, sorting, dashboard summary and overall progress,
responsive layout. Every task query is scoped to the authenticated user in SQL, so other users' tasks return 404.

## Structure
```
backend/  schema.sql  .env.example
  src/ app.js server.js db.js  routes/(auth,tasks).js  middleware/auth.js  scripts/(init,seed).js
frontend/ index.html vite.config.js
  src/ App.jsx main.jsx utils.js styles.css  components/  pages/  services/api.js  context/AuthContext.jsx
```

## Setup (Node 18+ and PostgreSQL 13+)
1. Create the database:
   ```
   psql -U postgres -c "CREATE DATABASE taskflow;"
   ```
2. Backend:
   ```
   cd backend
   cp .env.example .env        # then edit DATABASE_URL and set a long random JWT_SECRET
   npm install
   npm run db:init             # creates the tables from schema.sql
   npm run db:seed             # optional demo data
   npm run dev                 # http://localhost:5000
   ```
   Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
3. Frontend (new terminal):
   ```
   cd frontend
   npm install
   npm run dev                 # http://localhost:5173
   ```
The Vite dev server proxies `/api` to port 5000.

## Environment variables (backend/.env)
`DATABASE_URL`, `JWT_SECRET`, `PORT` (default 5000), `CLIENT_ORIGIN` (default http://localhost:5173).

## API
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/signup | – | Create account, returns token + user |
| POST | /api/auth/login | – | Sign in, returns token + user |
| GET | /api/auth/me | ✔ | Current user |
| GET | /api/tasks | ✔ | Own tasks |
| GET | /api/tasks/:id | ✔ | One own task (404 if not yours) |
| POST | /api/tasks | ✔ | Create |
| PUT | /api/tasks/:id | ✔ | Update |
| DELETE | /api/tasks/:id | ✔ | Delete |

## Authentication flow
Passwords are hashed with bcrypt (12 rounds). Login/signup returns a JWT (7-day expiry) holding the user id.
The frontend stores it in localStorage and sends `Authorization: Bearer <token>`. The middleware verifies it and
sets `req.userId`; the backend never trusts a user id from the client. Sign out deletes the token and redirects to /login.
An expired or invalid token (401) automatically signs the user out.

## Demo account (after `npm run db:seed`)
`demo@example.com` / `Demo@1234`
