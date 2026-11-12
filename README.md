# 📚 Library Management System

A full-stack library management application built with **React 19 + Vite** (frontend) and **Express 5 + PostgreSQL** (backend).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Seed Admin Account](#seed-admin-account)
- [API Reference](#api-reference)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7, Axios |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL 14+ |
| Auth | JWT (jsonwebtoken), bcryptjs |

---

## Features

- **Role-based access** – Admin vs. Member roles with approval workflow
- **Books catalog** – Add, edit, delete, search by title/author/category
- **Members management** – CRUD with active/inactive status
- **Issue & Return** – Track issued books with due dates
- **Fines** – Automatic fine calculation on late returns (configurable per-day rate)
- **Reservations** – Members can reserve unavailable books
- **Dashboard** – Stats at a glance (admin only)
- **Light / Dark theme** – Persisted in `localStorage`

---

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 (running locally or remote)
- **npm** (or pnpm / yarn)

---

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` → `backend/.env` and fill in your values:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_NAME` | Database name | `library_db` |
| `DB_PASSWORD` | PostgreSQL password | _(required)_ |
| `DB_PORT` | PostgreSQL port | `5432` |
| `JWT_SECRET` | Secret for signing JWTs | _(required, keep long & random)_ |
| `SEED_ADMIN_NAME` | Admin display name for seed | `Admin` |
| `SEED_ADMIN_EMAIL` | Admin email for seed | `admin@example.com` |
| `SEED_ADMIN_PASSWORD` | Admin password for seed | `admin123` |
| `FINE_PER_DAY` | Fine amount (₹) per late day | `5` |

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` → `frontend/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:5000/api` |

---

## Database Setup

1. Create the database:

```bash
psql -U postgres -c "CREATE DATABASE library_db;"
```

2. Run the schema:

```bash
psql -U postgres -d library_db -f backend/schema.sql
```

### Schema Overview

| Table | Purpose |
|-------|---------|
| `users` | Auth accounts (`admin` / `member`, status: `pending` / `approved` / `rejected`) |
| `books` | Book catalog with copy tracking |
| `members` | Library card holders (linked to users) |
| `transactions` | Issue / return records |
| `fines` | Late-return fines per transaction |
| `reservations` | Reservations for unavailable books |

---

## Running the App

### Backend

```bash
cd backend
npm install
npm run dev        # nodemon - auto-restarts on file change
# or: node server.js
```

Server starts at: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at: `http://localhost:5173`

---

## Seed Admin Account

After running the schema, create the first admin account:

```bash
cd backend
node seed.js
```

This reads `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `backend/.env`.  
Default credentials: `admin@example.com` / `admin123` — **change these in `.env` before seeding in production**.

---

## API Reference

All protected routes require `Authorization: Bearer <token>` header.  
Admin-only routes additionally require `role === 'admin'` in the JWT payload.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | — | Register new member (status: pending) |
| POST | `/login` | — | Login; returns JWT token |
| GET | `/pending-users` | Admin | List users awaiting approval |
| PUT | `/approve/:id` | Admin | Approve a pending user |
| PUT | `/reject/:id` | Admin | Reject a pending user |

### Books — `/api/books`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | List all books (supports `?title=&author=&category=`) |
| GET | `/:id` | — | Get single book |
| POST | `/` | Admin | Add new book |
| PUT | `/:id` | Admin | Update book |
| DELETE | `/:id` | Admin | Delete book |

### Members — `/api/members`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | List all members |
| GET | `/:id` | Protected | Get single member |
| POST | `/` | Admin | Add new member |
| PUT | `/:id` | Admin | Update member |
| DELETE | `/:id` | Admin | Delete member |

### Transactions — `/api/transactions`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | List all transactions |
| POST | `/issue` | Admin | Issue a book to a member |
| PUT | `/return/:id` | Admin | Return a book (auto-calculates fine if late) |

### Fines — `/api/fines`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | List all fines |
| PUT | `/pay/:id` | Admin | Mark fine as paid |

### Reservations — `/api/reservations`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | List all reservations |
| POST | `/` | Protected | Create a reservation |
| PUT | `/cancel/:id` | Protected | Cancel a reservation |

### Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | Stats: total books, members, issued, overdue, unpaid fines |

---

## Project Structure

```
library-management-system/
├── backend/
│   ├── config/db.js            # pg connection pool
│   ├── controllers/            # business logic
│   ├── middleware/             # auth (protect, isAdmin), validation
│   ├── routes/                 # Express routers
│   ├── schema.sql              # DB schema (run once)
│   ├── seed.js                 # creates first admin
│   ├── server.js               # entry point
│   ├── .env                    # ⚠️  never commit this
│   └── .env.example            # template
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # router + header + theme
│   │   ├── context/            # AuthContext
│   │   ├── components/         # BookCard, MemberCard, FineCard, etc.
│   │   ├── pages/              # page-level components
│   │   └── services/api.js     # axios helpers for all endpoints
│   ├── .env                    # ⚠️  never commit this
│   └── .env.example            # template
└── docs/
    └── AUDIT.md                # codebase audit
```

