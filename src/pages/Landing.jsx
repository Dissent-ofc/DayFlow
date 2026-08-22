import { Link } from "react-router-dom";
import DayBars from "../components/DayBars";
import "./Landing.css";

const FEATURES = [
  {
    tag: "Clock in / clock out",
    title: "Attendance",
    desc: "Daily and weekly views with present, absent, half-day and leave states — visible to employees for themselves, and to HR for everyone.",
  },
  {
    tag: "Paid · Sick · Unpaid",
    title: "Leave & time-off",
    desc: "Employees pick a type and a date range; HR approves, rejects or comments, and the record updates immediately.",
  },
  {
    tag: "Read-only for employees",
    title: "Payroll visibility",
    desc: "Salary structure is visible to the person it belongs to, and editable only by Admin — no spreadsheets in between.",
  },
  {
    tag: "One queue, no guessing",
    title: "Approvals",
    desc: "Every leave and attendance exception lands in a single queue Admin and HR officers can act on from one screen.",
  },
];

const ROLES = [
  {
    label: "Employee",
    heading: "Your week, at a glance",
    points: [
      "View and edit your own profile, phone, address and photo",
      "Check in / check out and track your attendance history",
      "Apply for leave and follow its status to a decision",
      "View your salary structure — read only",
    ],
  },
  {
    label: "Admin / HR Officer",
    heading: "Every employee, one console",
    points: [
      "Switch between employee records without losing your place",
      "Approve or reject leave and attendance with a comment",
      "Edit any employee's details and salary structure",
      "Onboard new hires with a system-issued ID and password",
    ],
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="nav">
        <div className="container nav__row">
          <div className="nav__brand">
            <span className="nav__mark" aria-hidden="true" />
            <span className="mono nav__wordmark">DayFlow</span>
          </div>
          <nav className="nav__links">
            <a href="#features">Product</a>
            <a href="#roles">Roles</a>
            <a href="#cta">Get started</a>
          </nav>
          <Link to="/login" className="btn btn--ghost nav__cta">
            Sign in
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="container hero__row">
          <div className="hero__copy">
            <p className="eyebrow mono">Human Resource Management System</p>
            <h1>
              Every workday,
              <br />
              perfectly aligned.
            </h1>
            <p className="hero__sub">
              DayFlow brings onboarding, attendance, leave and payroll
              visibility into one system of record — so the workweek stays
              legible for everyone in it, from a new hire's first sign-in to
              an HR officer's Friday approvals.
            </p>
            <div className="hero__actions">
              <Link to="/login" className="btn btn--primary">
                Sign in to DayFlow
              </Link>
              <Link to="/login?mode=signup" className="btn btn--text">
                Register your company →
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            <DayBars size="lg" />
            <p className="hero__caption mono">MON — SUN, EVERY TIME</p>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <p className="eyebrow mono">What it replaces</p>
          <h2>Four things HR does every week, in one place</h2>
          <div className="features__grid">
            {FEATURES.map((f) => (
              <article className="feature-card" key={f.title}>
                <p className="feature-card__tag mono">{f.tag}</p>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="roles" id="roles">
        <div className="container">
          <p className="eyebrow mono">Two logins, two views</p>
          <h2>Built around who's asking</h2>
          <div className="roles__grid">
            {ROLES.map((r) => (
              <div className="role-card" key={r.label}>
                <span className="role-card__label mono">{r.label}</span>
                <h3>{r.heading}</h3>
                <ul>
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" id="cta">
        <div className="container cta__row">
          <div>
            <h2>Ready to align your week?</h2>
            <p>Sign in with your employee ID, or register your company to get started.</p>
          </div>
          <Link to="/login" className="btn btn--primary btn--lg">
            Sign in
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__row">
          <span className="mono">DayFlow HRMS</span>
          <span className="text-muted">Built for Full Stack Development · 22ISE442</span>
        </div>
      </footer>
    </div>
  );
}
