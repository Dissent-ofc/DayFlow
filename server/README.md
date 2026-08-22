# dayflow-api

Express + Prisma + PostgreSQL backend for DayFlow HRMS.

## Setup

1. **Create a free Postgres database on [Neon](https://neon.tech)**
   - Sign up, create a project named `dayflow-db`.
   - Copy the pooled connection string it gives you.

2. **Configure environment**
   ```
   cp .env.example .env
   ```
   Paste the Neon connection string into `DATABASE_URL`, and generate a
   `JWT_SECRET` with `openssl rand -base64 48`.

3. **Install and generate the Prisma client**
   ```
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   ```
   This creates the tables in your Neon database from `prisma/schema.prisma`.

4. **Run the dev server**
   ```
   npm run dev
   ```
   API runs on `http://localhost:4000`. The frontend (`../` Vite app) expects
   this by default — check `CLIENT_ORIGIN` in `.env` matches your frontend's
   dev URL (`http://localhost:5173` by default).

## Auth flow implemented so far

- `POST /auth/register-company` — creates a Company + its first Admin. This
  is the "Register company" tab on the Sign Up screen.
- `POST /auth/login` — accepts `identifier` (Login ID or email) + `password`.
  Sets an httpOnly JWT cookie.
- `POST /auth/logout`
- `POST /auth/change-password` — forced on first login for admin-created employees.
- `GET /auth/me` — current signed-in employee.
- `GET /employees` — directory for the dashboard (any signed-in user).
- `GET /employees/:id` — view-only profile.
- `POST /employees` — Admin/HR onboards a new employee; Login ID and a
  temporary password are auto-generated per the wireframe's ID format
  (see `src/utils/loginId.js`) and returned once in the response so HR can
  hand it to the new hire.

## Not built yet

Attendance check-in/out, leave requests/approvals, and salary structure
routes — these come with their matching frontend screens.

## A note on this sandbox

Prisma's engine binaries couldn't be downloaded in the environment this was
built in (network allowlist), so `prisma generate` / `migrate` haven't been
run or verified here — run them yourself per step 3 above once you have a
real `DATABASE_URL`. Everything else (Express routes, JWT/bcrypt logic) runs
on plain Node with no restricted downloads.
