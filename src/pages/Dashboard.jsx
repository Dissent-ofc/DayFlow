import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import { mockEmployees } from "../data/mockEmployees";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockEmployees;
    return mockEmployees.filter(
      (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q),
    );
  }, [query]);

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
          {filtered.length} of {mockEmployees.length}
        </span>
      </div>

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
