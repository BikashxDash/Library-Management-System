-- =============================================================================
-- Library Management System - Database Schema
-- PostgreSQL 14+
-- Run once: psql -U <user> -d library_db -f schema.sql
-- =============================================================================

-- -------------------------
-- 1. USERS  (auth accounts)
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL       PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password     TEXT         NOT NULL,
  role         VARCHAR(20)  NOT NULL DEFAULT 'member'
                            CHECK (role IN ('admin', 'member')),
  status       VARCHAR(20)  NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

-- -------------------------
-- 2. BOOKS
-- -------------------------
CREATE TABLE IF NOT EXISTS books (
  id               SERIAL       PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  author           VARCHAR(255) NOT NULL,
  isbn             VARCHAR(20)  UNIQUE,
  category         VARCHAR(100) CHECK (category IN (
                                  'computer-science', 'mechanical', 'electronics', 'electrical',
                                  'civil', 'philosophy', 'fiction', 'non-fiction', 'mathematics',
                                  'physics', 'chemistry', 'biography', 'comics', 'magazine',
                                  'newspaper', 'history', 'language'
                                )),
  total_copies     INTEGER      NOT NULL DEFAULT 1
                                CHECK (total_copies >= 0),
  available_copies INTEGER      NOT NULL DEFAULT 1
                                CHECK (available_copies >= 0),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT copies_not_exceed_total CHECK (available_copies <= total_copies)
);

CREATE INDEX IF NOT EXISTS idx_books_category ON books (category);
CREATE INDEX IF NOT EXISTS idx_books_title    ON books USING gin (to_tsvector('english', title));

-- -------------------------
-- 3. MEMBERS  (library card holders, separate from auth users)
-- -------------------------
CREATE TABLE IF NOT EXISTS members (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  phone       VARCHAR(15),
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_email ON members (email);

-- -------------------------
-- 4. TRANSACTIONS  (issue / return)
-- -------------------------
CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL      PRIMARY KEY,
  book_id     INTEGER     NOT NULL REFERENCES books(id)    ON DELETE RESTRICT,
  member_id   INTEGER     NOT NULL REFERENCES members(id)  ON DELETE RESTRICT,
  issue_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
  due_date    DATE        NOT NULL,
  return_date DATE,
  status      VARCHAR(20) NOT NULL DEFAULT 'issued'
                          CHECK (status IN ('issued', 'returned')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_book_id   ON transactions (book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON transactions (member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status    ON transactions (status);

-- -------------------------
-- 5. FINES
-- -------------------------
CREATE TABLE IF NOT EXISTS fines (
  id             SERIAL       PRIMARY KEY,
  transaction_id INTEGER      NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  member_id      INTEGER      NOT NULL REFERENCES members(id)      ON DELETE RESTRICT,
  amount         NUMERIC(8,2) NOT NULL CHECK (amount >= 0),
  days_late      INTEGER      NOT NULL CHECK (days_late > 0),
  status         VARCHAR(20)  NOT NULL DEFAULT 'unpaid'
                              CHECK (status IN ('unpaid', 'paid')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fines_member_id ON fines (member_id);
CREATE INDEX IF NOT EXISTS idx_fines_status    ON fines (status);

-- -------------------------
-- 6. RESERVATIONS
-- -------------------------
CREATE TABLE IF NOT EXISTS reservations (
  id               SERIAL      PRIMARY KEY,
  book_id          INTEGER     NOT NULL REFERENCES books(id)   ON DELETE RESTRICT,
  member_id        INTEGER     NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  reservation_date DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_book_id   ON reservations (book_id);
CREATE INDEX IF NOT EXISTS idx_reservations_member_id ON reservations (member_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status    ON reservations (status);

