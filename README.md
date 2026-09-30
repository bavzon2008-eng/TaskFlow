# TaskFlow – Full-Stack Task Manager

React + Vite frontend, Express API, PostgreSQL database, and JWT authentication.

## 🚀 Live Demo

**https://task-flow-qaxcvexo8-bavana1.vercel.app**

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Render PostgreSQL

---

## Features

- Sign up / Sign in / Sign out
- JWT-based authentication
- Protected routes
- Secure password hashing with bcrypt
- User-specific task management
- Create, read, update, and delete tasks
- Task status management
- Task progress tracking
- Automatic status/progress synchronization:
  - `100%` ⇒ `Completed`
  - `Completed` ⇒ `100%`
  - `Not Started` ⇒ `0%`
- Due dates
- Overdue task detection
- Task filtering:
  - All
  - Not Started
  - In Progress
  - Completed
  - Overdue
- Task search
- Task sorting
- Dashboard summary
- Overall progress tracking
- Responsive layout
- User-isolated database queries
- Invalid/expired JWT tokens automatically sign the user out

Every task query is scoped to the authenticated user in SQL, so users cannot access another user's tasks.

---

## Project Structure

```text
TaskFlow/
│
├── backend/
│   ├── schema.sql
│   ├── .env.example
│   ├── package.json
│   │
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── db.js
│       │
│       ├── middleware/
│       │   └── auth.js
│       │
│       ├── routes/
│       │   ├── auth.js
│       │   └── tasks.js
│       │
│       └── scripts/
│           ├── init.js
│           └── seed.js
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   │
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── utils.js
│       ├── styles.css
│       │
│       ├── components/
│       ├── pages/
│       ├── services/
│       │   └── api.js
│       └── context/
│           └── AuthContext.jsx
│
├── .gitignore
└── README.md
