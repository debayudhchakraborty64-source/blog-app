# Inkwell — A MERN Blog App

A full-stack blog application built with **React** (frontend) and **Node.js + Express + MongoDB** (backend).

## Project structure

```
blogapp/
├── frontend/           # React + Vite single-page app
│   ├── public/
│   ├── src/
│   │   ├── components/ # Navbar, PostCard, Loader, ProtectedRoute, PostForm
│   │   ├── context/    # AuthContext (login state + JWT)
│   │   ├── pages/      # Home, PostDetail, Login, Register, NewPost, EditPost
│   │   ├── App.jsx
│   │   ├── api.js      # shared axios instance
│   │   └── styles.css
│   └── vite.config.js  # proxies /api → http://localhost:5000
├── backend/            # Express REST API
│   ├── config/         # MongoDB connection
│   ├── controllers/    # auth, posts, comments logic
│   ├── middleware/     # JWT auth, error handling
│   ├── models/         # User, Post, Comment (Mongoose)
│   ├── routes/         # /api/auth, /api/posts
│   ├── server.js
│   └── .env            # (gitignored) real secrets live here
└── .gitignore
```

## Features

- Register / log in with JWT auth (passwords hashed with bcrypt)
- Create, edit and delete your own blog posts
- Search posts by title or tag, paginated feed
- Like / unlike posts, thread of comments (author or post owner can delete)
- `.gitignore` in the root, `backend/` and `frontend/` — all `.env` files, secrets and keys are excluded from git

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm run dev      # or: npm start
```

- Create `backend/.env` from the provided template `backend/.env.example`.
- Set **MONGO_URI** to a local MongoDB (`mongodb://127.0.0.1:27017/blogapp`) or a MongoDB Atlas connection string.
- A random `JWT_SECRET` should already be in `.env` — never share or commit it.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # opens http://localhost:3000
```

The Vite dev server proxies `/api/*` to the backend on port 5000, so no CORS setup is needed in development.

## API reference

| Method | Route                              | Access  | Description                     |
| ------ | ---------------------------------- | ------- | ------------------------------- |
| POST   | `/api/auth/register`               | Public  | Create account, returns JWT     |
| POST   | `/api/auth/login`                  | Public  | Log in, returns JWT             |
| GET    | `/api/auth/me`                     | Private | Current user                    |
| GET    | `/api/posts`                       | Public  | List posts (`?page=&search=`)   |
| GET    | `/api/posts/:id`                   | Public  | Single post                     |
| POST   | `/api/posts`                       | Private | Create post                     |
| PUT    | `/api/posts/:id`                   | Private | Edit (author only)              |
| DELETE | `/api/posts/:id`                   | Private | Delete (author only)            |
| PUT    | `/api/posts/:id/like`              | Private | Toggle like                     |
| GET    | `/api/posts/:id/comments`          | Public  | List comments                   |
| POST   | `/api/posts/:id/comments`          | Private | Add comment                     |
| DELETE | `/api/posts/:id/comments/:commentId` | Private | Delete comment (owner)       |
| GET    | `/api/health`                      | Public  | Health check                    |

Private routes require header: `Authorization: Bearer <token>`

## Secrets & keys policy

- `backend/.env` holds `MONGO_URI`, `JWT_SECRET`, etc. — it is **gitignored** and never committed.
- `backend/.env.example` is the committed template with placeholder values only.
- If a secret ever leaks, rotate it (regenerate `JWT_SECRET`) and force all users to log in again.
