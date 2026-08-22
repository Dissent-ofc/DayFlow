import { Plane } from "lucide-react";

const STATUS_META = {
  present: { label: "Present in office" },
  leave: { label: "On leave" },
  absent: { label: "Absent — no time off applied" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.absent;

  if (status === "leave") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-accent-2"
        title={meta.label}
      >
        <Plane size={12} />
      </span>
    );
  }

  return (
    <span
      className={`h-2.5 w-2.5 rounded-full ${status === "present" ? "bg-success" : "bg-warn"}`}
      title={meta.label}
    />
  );
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EmployeeCard({ employee, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left transition hover:border-accent hover:-translate-y-0.5"
    >
      <span className="absolute right-3 top-3">
        <StatusBadge status={employee.status} />
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-raised font-display text-base font-semibold text-accent-2 transition group-hover:bg-border-soft">
        {initials(employee.name)}
      </span>
      <div>
        <p className="text-sm font-medium text-text">{employee.name}</p>
        <p className="font-mono text-[11px] text-faint">{employee.id}</p>
      </div>
    </button>
  );
}
