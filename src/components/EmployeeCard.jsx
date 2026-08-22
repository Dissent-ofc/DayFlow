import { Plane, Trash2 } from "lucide-react";

const STATUS_META = {
  present: { label: "Active · Present in office", shortLabel: "Active" },
  active: { label: "Active · Present in office", shortLabel: "Active" },
  leave: { label: "On leave" },
  absent: { label: "Inactive · Absent — no time off applied", shortLabel: "Inactive" },
  inactive: { label: "Inactive · Absent — no time off applied", shortLabel: "Inactive" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.absent;

  if (status === "leave") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-surface px-2 py-1 text-[10px] font-semibold text-accent-2" title={meta.label}>
        <Plane size={12} />
        <span>On leave</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full bg-surface px-2 py-1 text-[10px] font-semibold text-text" title={meta.label}>
      <span className={`h-2.5 w-2.5 rounded-full ${status === "present" || status === "active" ? "bg-success" : "bg-danger"}`} />
      <span>{meta.shortLabel}</span>
    </span>
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

export default function EmployeeCard({ employee, onClick, canDelete, onDelete }) {
  return (
    <div
      className="employee-card group relative flex flex-col items-start gap-3 rounded-xl border border-border p-4 text-left transition hover:border-accent hover:-translate-y-0.5"
    >
      <button type="button" onClick={onClick} className="w-full text-left">
      <span className="absolute right-3 top-3">
        <StatusBadge status={employee.status} />
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-raised font-display text-base font-semibold text-accent-2 transition group-hover:bg-border-soft">
        {initials(employee.name)}
      </span>
      <div className="employee-card__info">
        <p className="text-sm font-medium text-text">{employee.name}</p>
        <p className="font-mono text-[11px] text-faint">{employee.loginId}</p>
      </div>
      </button>
      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete employee"
          aria-label={`Delete ${employee.name}`}
          className="absolute right-3 bottom-3 rounded-md p-1.5 text-muted transition hover:bg-danger/15 hover:text-danger"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
