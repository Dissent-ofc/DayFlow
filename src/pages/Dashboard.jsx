import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import { mockEmployees } from "../data/mockEmployees";
import { api } from "../lib/api";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState(mockEmployees);
  const [usingMockData, setUsingMockData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .listEmployees()
      .then((data) => {
        // API doesn't return a live "status" field yet (that's the
        // Attendance module) — default everyone to present for now.
        setEmployees(
          data.map((e) => ({
            id: e.loginId,
            name: `${e.firstName} ${e.lastName}`,
            status: "present",
          })),
        );
        setUsingMockData(false);
      })
      .catch(() => {
        // No backend running / not signed in yet — keep showing mock data
        // so the dashboard is still browsable standalone.
        setUsingMockData(true);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q),
    );
  }, [query, employees]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-display text-sm font-semibold text-bg transition hover:bg-[#C465EE]">
          <Plus size={16} /> New
        </button>
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees…"
            className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>
        <span className="font-mono text-xs text-faint">
          {filtered.length} of {employees.length}
        </span>
      </div>

      {usingMockData && (
        <p className="mb-4 font-mono text-[11px] text-faint">
          Showing sample data — connect the API and sign in to see real employees.
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted">
          No employees match "{query}".
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onClick={() => navigate(`/employees/${emp.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
