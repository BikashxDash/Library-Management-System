# Codebase Audit

**Date:** 2026-11-12  
**Repo:** Library Management System (React 19 + Vite / Express 5 + PostgreSQL)

---

## Project Structure

```
library-management-system/
├── backend/
│   ├── config/db.js            # pg Pool; .env-driven
│   ├── controllers/            # authController, bookController, memberController,
│   │                           # transactionController, fineController,
│   │                           # reservationController, dashboardController
│   ├── middleware/             # authMiddleware (protect, isAdmin), validationMiddleware
│   ├── routes/                 # one file per resource
│   ├── seed.js                 # creates first admin
│   ├── server.js               # Express entry-point
│   └── .env                    # ⚠️ COMMITTED – contains real credentials & tokens
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Router + Header + CSS variables + theme toggle
│   │   ├── context/AuthContext.jsx
│   │   ├── components/         # BookCard, BookList, BookCategories, MemberCard,
│   │   │                       # MemberList, FineCard, FineList, ProtectedRoute
│   │   ├── pages/              # HomePage, LoginPage, RegisterPage, DashboardPage,
│   │   │                       # MembersPage, AddBookPage, EditBookPage,
│   │   │                       # AddMemberPage, EditMemberPage
│   │   └── services/api.js     # axios instance; hardcoded http://localhost:5000/api
│   └── vite.config.js
└── docs/AUDIT.md               # this file
```

---

## What Works

| Area | Status |
|------|--------|
| Register (pending → admin approves) | ✅ Correct flow in authController |
| Login blocked for pending/rejected | ✅ Already implemented |
| JWT issue + verify (`protect`) | ✅ |
| `isAdmin` middleware | ✅ defined, but under-applied (see issues) |
| Books CRUD | ✅ functional |
| Members CRUD | ✅ functional |
| Issue / return book | ✅ basic flow works |
| Fine creation on late return | ✅ |
| Fine pay | ✅ |
| Reservations (create/cancel/list) | ✅ |
| Dashboard stats | ✅ |
| Light/dark theme | ✅ CSS variables in App.jsx |
| Responsive hamburger nav | ✅ |

---

## Issues Found

### 🔴 Critical / Security

1. **`.env` committed to repo** – contains `DB_PASSWORD=postgres@18`, `JWT_SECRET`, and live JWT tokens. Must be gitignored; `.env.example` needed.
2. **No `isAdmin` on book/member mutate routes** – `bookRoutes.js` uses `protect` only (not `isAdmin`) for POST/PUT/DELETE. Any approved member can add, edit, or delete books and members.
3. **No `isAdmin` on fines** – both `GET /fines` and `PUT /fines/pay/:id` use only `protect`.
4. **`GET /members` and `GET /transactions` are unprotected** – any anonymous caller can list all members and all transactions.
5. **`GET /reservations` is unprotected** – returns all reservations with member names.
6. **No DB transaction in `issueBook`** – availability check and INSERT are two separate queries; a concurrent request can cause `available_copies` to go negative.
7. **No DB transaction in `returnBook`** – availability restore and fine insert are not atomic.
8. **No duplicate-issue guard** – nothing stops issuing the same book twice to the same member.
9. **No unpaid-fine guard** – a member with unpaid fines can still issue books.
10. **Date math uses `new Date()` (timestamp)** – compares current timestamp against `due_date` (a date). A book returned at 23:59 on the due date is wrongly fined 1 day.

### 🟡 Configuration / Ops

11. **Hardcoded API URL** – `api.js` has `const API_BASE_URL = 'http://localhost:5000/api'`; no `VITE_API_URL` env var.
12. **Hardcoded admin credentials** – `seed.js` has `admin@example.com` / `admin123` baked in.
13. **Hardcoded fine-per-day** – `finePerDay = 5` is a magic constant inside `returnBook`; should be an env/config value.
14. **No `schema.sql`** – the database schema is not version-controlled; onboarding requires knowing column names from the code.
15. **No `README.md` at root** – no setup or run instructions.
16. **No helmet / rate-limiting** – the server is wide open to brute-force on `/auth` endpoints.
17. **No central error handler** – unhandled exceptions can expose stack traces.

### 🟠 Frontend

18. **`window.alert` / `window.confirm` used** – `BookCard`, `MemberCard`, `FineCard` use browser dialogs, which are blocked in iframes and look bad.
19. **Admin-only links shown to all logged-in users** – nav shows "Members", "Add Member", "Add Book" to any logged-in user (even non-admin members).
20. **No Dashboard or Fines link in nav** – these pages exist but aren't reachable from the navbar.
21. **Missing pages** – no Issue/Return Books page, no Transactions list, no Pending Users page, no Reservations page.
22. **`services/api.js` missing** – no API helpers for transactions, reservations, pending users, approve/reject.
23. **`AddBookPage` / `AddMemberPage`** – use raw inline styles instead of the CSS-variable design system used elsewhere.
24. **`BookList`** – fetches all books, then filters client-side by category slug; wastes bandwidth as catalog grows.
25. **`ProtectedRoute`** – checks only `user != null`; does not enforce `isAdmin` for admin-only pages.

### 🟢 Minor / Code Quality

26. **No ESLint config** – `frontend/eslint.config.js` exists but backend has nothing.
27. **No tests** – neither backend nor frontend have any test suite.
28. **No pagination** – books, members, and transactions are returned without limit.
29. **`reservationController`** references `r.created_at` in ORDER BY but schema likely has `reservation_date`; may differ.
30. **Comment language** – comments are in Hinglish (Hindi + English mix); consistent, but be aware for international contributors.

---

## Schema inferred from controllers

| Table | Columns (inferred) |
|-------|-------------------|
| `users` | `id`, `name`, `email`, `password`, `role` ('admin'/'member'), `status` ('pending'/'approved'/'rejected'), `created_at` |
| `books` | `id`, `title`, `author`, `isbn`, `category`, `total_copies`, `available_copies` |
| `members` | `id`, `name`, `email`, `phone`, `is_active`, `created_at` |
| `transactions` | `id`, `book_id` FK books, `member_id` FK members, `issue_date`, `due_date`, `return_date`, `status` ('issued'/'returned') |
| `fines` | `id`, `transaction_id` FK transactions, `member_id` FK members, `amount`, `days_late`, `status` ('unpaid'/'paid'), `created_at` |
| `reservations` | `id`, `book_id` FK books, `member_id` FK members, `status` ('pending'/'cancelled'), `reservation_date`, `created_at` |

---

## Phase Plan Alignment

| Phase | Focus |
|-------|-------|
| **1 – Foundation** | `schema.sql`, `.env.example` files, fix hardcoded URL, seed from env, root `README.md` |
| **2 – Security** | `isAdmin` guards, DB transactions, fine/dupe guards, helmet, rate-limit, error handler |
| **3 – Frontend** | New pages, role-based nav, inline messages, complete `api.js` |
| **4 – Quality** | Jest + supertest tests, ESLint fixes, pagination, E2E walkthrough |

