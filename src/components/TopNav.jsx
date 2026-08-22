import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAttendance } from "../context/AttendanceContext";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { to: "/dashboard", label: "Employees" },
  { to: "/attendance", label: "Attendance" },
  { to: "/timeoff", label: "Time Off" },
];

function getInitials(user) {
  if (!user) return "??";
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "??";
}

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isCheckedIn } = useAttendance();
  const { user, logout } = useAuth();

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await logout();
    } catch {
      // clear client state even if the server call fails
    }
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-6 py-3">
        <NavLink to="/dashboard" className="flex items-center gap-2 pr-4">
          <span className="inline-block h-4 w-4 rounded-[5px] bg-gradient-to-br from-accent to-accent-2" />
          <span className="font-mono text-[15px] font-semibold text-text">DayFlow</span>
        </NavLink>

        <nav className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-accent text-bg" : "text-muted hover:text-text"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3" ref={menuRef}>
          <span
            className={`h-2.5 w-2.5 rounded-full ${isCheckedIn ? "bg-success" : "bg-danger"}`}
            title={isCheckedIn ? "Checked in" : "Not checked in"}
          />

          <button
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface p-1 pr-2 hover:border-accent"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-accent-2">
              {getInitials(user)}
            </span>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-6 top-14 w-44 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-xl"
            >
              <button
                role="menuitem"
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-text hover:bg-surface"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                <UserRound size={15} /> My Profile
              </button>
              <button
                role="menuitem"
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-danger hover:bg-surface"
                onClick={handleLogout}
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
