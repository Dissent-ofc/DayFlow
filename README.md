# DayFlow HRMS

DayFlow is a role-based Human Resource Management System built with React, Vite, Express, Prisma, and PostgreSQL. It manages employee records, attendance, Time Off, salary calculations, and role-specific access.

## Features

- Company registration and login with email or generated Login ID.
- Roles: `ADMIN`, `HR`, and `EMPLOYEE`.
- Employee directory with profile cards, Login IDs, and attendance status.
- Admin/HR onboarding with generated Login ID, email, and temporary password.
- Forced password change for newly created accounts.
- Persistent check-in and check-out records.
- Weekly, monthly, and yearly attendance views.
- Present, absent, half-day, and on-leave statuses.
- Admin/HR daily attendance list with search, timings, work hours, and extra hours.
- Employee-only Time Off calendar and request history.
- Admin/HR leave queue with request details, approval, and rejection.
- Approved leave synchronized to attendance and salary calculations.
- Employee self-salary view and HR company salary breakdown page.

## Technology

- Frontend: React 19, Vite, React Router, Tailwind CSS 4, Lucide React, Oxlint.
- Backend: Node.js, Express 5, PostgreSQL, Prisma 7, JWT, bcryptjs.

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL database; Neon is recommended for development

## Environment Setup

Create `server/.env`:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_ORIGIN="http://localhost:5173"
```

Use a complete real PostgreSQL URL beginning with `postgresql://`. Do not use placeholder values such as `host`, `database`, or `base`.

## Installation

```powershell
cd C:\Users\spars\OneDrive\Desktop\DayFlow
npm install

cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

The seed creates demo users, salary structures, approved leave requests, private information, and two months of attendance history. It can be rerun safely.

## Run the Application

Use two terminals.

API server:

```powershell
cd C:\Users\spars\OneDrive\Desktop\DayFlow\server
npm run dev
```

API URL: `http://localhost:4000`.

Frontend:

```powershell
cd C:\Users\spars\OneDrive\Desktop\DayFlow
npm run dev
```

Open the Vite URL printed in the terminal. It is normally `http://localhost:5173`; if occupied, Vite may use `http://localhost:5174`.

## Roles and Permissions

### Admin

- Register and manage the company.
- Add Admin, HR, and Employee accounts.
- Delete other employee records.
- View company attendance and Time Off requests.
- Approve or reject leave requests.
- View salary information.

### HR

- Add Employee and HR accounts, but cannot create Admin accounts.
- Delete other employee records.
- View company attendance and Time Off requests.
- Approve or reject leave requests.
- View the HR-only Salary page for all company users.

### Employee

- View permitted employee profiles.
- Check in and check out.
- View only their own attendance and Time Off data.
- Submit leave requests and follow decisions.
- View only their own salary.

## Authentication and New Accounts

Admin and HR-created accounts receive a generated Login ID, an email in the format `<firstname><loginid>@dayflow.io`, and a temporary password. New accounts have `mustChangePassword = true` and are redirected to Change Password on first login.

## Attendance

- Check-in creates or updates today's attendance record.
- Check-out preserves check-in data and records checkout.
- Admin/HR see a daily list containing all company users, including Admin and HR.
- Employees see their own weekly, monthly, and yearly calendar.
- Past weekdays without a record are treated as absent in calendar summaries.
- Weekly view can show leave/absence reasons; monthly and yearly views hide reasons.
- Seeded check-ins use 9:00–10:00 AM India time.
- Seeded check-outs use 5:00–6:00 PM India time.

## Time Off

Employees can request Paid, Sick, or Unpaid leave and see only their own requests. Admin and HR see the company-wide queue. Requests can be opened to view the reason, then approved or rejected.

Pending requests show Approve and Reject actions. Decided requests display their final `Approved` or `Rejected` status and do not offer the opposite action. Approved leave dates are synchronized into attendance as `LEAVE` records.

## Salary Calculation

Salary is calculated server-side for the current month. The default employee wage is `₹50,000`.

- Basic salary: 50% of monthly wage.
- HRA: 50% of Basic salary.
- Standard allowance: `₹4,167`.
- Performance bonus: approximately 8.33% of monthly wage.
- Leave travel allowance: approximately 8.33% of monthly wage.
- Provident Fund: 12% of Basic salary.
- Professional tax: `₹200`.
- Absent and unpaid-leave deductions based on daily wage.
- Gross salary, total deductions, and net pay.

Employees receive their own computed salary through the profile. HR receives the company-wide breakdown through the HR-only Salary page. Authorization is enforced by the backend.

## API Endpoints

```text
POST /auth/register-company       POST /auth/login
POST /auth/logout                 POST /auth/change-password
GET  /auth/me

GET /employees                    GET /employees/:id
POST /employees                   DELETE /employees/:id

GET /attendance?employeeId=&from=&to=&view=
GET /attendance/list?date=YYYY-MM-DD       # Admin/HR
POST /attendance/check-in         POST /attendance/check-out
POST /attendance/mark                       # Admin/HR

GET /timeoff                      POST /timeoff
GET /timeoff/requests                       # Admin/HR
PATCH /timeoff/:id/status                   # Admin/HR

GET /salary/me                    GET /salary/company # HR only
```

All authenticated requests use the httpOnly `dayflow_token` cookie and credentialed CORS.

## Demo Credentials

Created by `npm run prisma:seed`.

Admin: `OISPAD20220001` / `SparshAdmin@2026`

HR: `OIPRHR20220011` / `PriyaHR@2022`

| Employee | Login ID | Password |
|---|---|---|
| Jordan Dean | `OIJODO20220001` | `Jordan@2022` |
| Riya Halder | `OIRIHA20220002` | `Riya@2022` |
| Akash Kapoor | `OIAKKA20220003` | `Akash@2022` |


## Useful Commands

Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

Backend: `npm run dev`, `npm start`, `npm run prisma:generate`, `npm run prisma:migrate`, `npm run prisma:seed`, `npm run prisma:studio`

## Troubleshooting

If Prisma cannot connect, verify that `DATABASE_URL` is a complete PostgreSQL URL and run `npx prisma migrate status` from `server`. If the frontend cannot reach the API, confirm the backend is running on port 4000 and that `CLIENT_ORIGIN` matches the Vite URL.

## Current Scope

Implemented: authentication, role-based employee management, persistent attendance, attendance calendars, Time Off requests and approvals, salary visibility, salary calculations, HR salary breakdowns, and seeded demo data.
