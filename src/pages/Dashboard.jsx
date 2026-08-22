import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    api.listEmployees()
      .then((data) => {
        // Normalize API response to the shape the card expects
        const normalized = data.map((emp) => ({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          loginId: emp.loginId,
          status: "present", // default; will be real once attendance is wired
          jobTitle: emp.jobTitle,
          avatarUrl: emp.avatarUrl,
        }));
        setEmployees(normalized);
      })
      .catch(() => {
        // If backend is unreachable, fall back gracefully
        setEmployees([]);
      })
      .finally(() => setLoadingList(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        (e.loginId && e.loginId.toLowerCase().includes(q)),
    );
  }, [employees, query]);

  if (loadingList) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="font-mono text-sm text-muted">Loading employees…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {isAdmin && (
          <button
            onClick={() => navigate("/employees/new")}
            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-display text-sm font-semibold text-bg transition hover:bg-[#C465EE]"
          >
            <Plus size={16} /> New
          </button>
        )}
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

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted">
          {employees.length === 0
            ? "No employees found. Add your first employee to get started."
            : `No employees match "${query}".`}
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
