import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, X } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManageEmployees = user?.role === "ADMIN" || user?.role === "HR";

  useEffect(() => {
    api.listEmployees()
      .then((data) => {
        // Normalize API response to the shape the card expects
        const normalized = data.map((emp) => ({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          loginId: emp.loginId,
          status: emp.attendance?.[0]?.status?.toLowerCase() ?? "active",
          jobTitle: emp.jobTitle,
          avatarUrl: emp.avatarUrl,
          role: emp.role,
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

  const statusCounts = useMemo(() => ({
    present: employees.filter((employee) => ["present", "active"].includes(employee.status)).length,
    leave: employees.filter((employee) => employee.status === "leave").length,
    absent: employees.filter((employee) => ["absent", "inactive"].includes(employee.status)).length,
  }), [employees]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await api.deleteEmployee(pendingDelete.id);
      setEmployees((current) => current.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loadingList) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="font-mono text-sm text-muted">Loading employees…</span>
      </div>
    );
  }

  return (
    <div>
      {user?.company && (
        <div className="mb-4 flex items-center justify-between border-b border-border-soft pb-3">
          <div className="flex items-center gap-2.5">
            {user.company.logoUrl && (
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface p-0.5 shadow-sm">
                <img
                  src={user.company.logoUrl}
                  alt={user.company.name}
                  className="h-full w-full object-contain rounded"
                />
              </div>
            )}
            <div>
              <h1 className="font-display text-base font-semibold text-text leading-none">
                {user.company.name}
              </h1>
              <p className="font-mono text-[10px] text-faint mt-0.5">Organization Directory</p>
            </div>
          </div>
          <span className="font-mono text-[11px] text-accent-2 bg-accent-2/10 border border-accent-2/20 px-2 py-0.5 rounded">
            CODE: {user.company.code || "HQ"}
          </span>
        </div>
      )}

      <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-lg border border-success/25 bg-success/8 p-3"><p className="font-display text-xl text-success">{statusCounts.present}</p><p className="text-xs text-muted">Present</p></div>
        <div className="rounded-lg border border-accent-2/25 bg-accent-2/8 p-3"><p className="font-display text-xl text-accent-2">{statusCounts.leave}</p><p className="text-xs text-muted">On leave</p></div>
        <div className="rounded-lg border border-danger/25 bg-danger/8 p-3"><p className="font-display text-xl text-danger">{statusCounts.absent}</p><p className="text-xs text-muted">Absent</p></div>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {canManageEmployees && (
          <button
            onClick={() => navigate("/employees/new")}
            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-display text-sm font-semibold text-bg transition hover:bg-[#C465EE]"
          >
            <Plus size={16} /> New
          </button>
        )}
        <div className="relative min-w-[220px] flex-1 lg:max-w-[460px]">
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
              canDelete={canManageEmployees && emp.id !== user?.id}
              onDelete={() => {
                setDeleteError("");
                setPendingDelete(emp);
              }}
            />
          ))}
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/75 px-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-xl border border-border bg-surface-raised p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-danger/15 p-2 text-danger"><Trash2 size={18} /></div>
                <div>
                  <h2 id="delete-title" className="font-display text-lg font-semibold text-text">Delete employee record?</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">This permanently removes {pendingDelete.name}'s profile and related records.</p>
                </div>
              </div>
              <button type="button" onClick={() => setPendingDelete(null)} className="rounded-md p-1 text-muted hover:bg-border-soft hover:text-text" aria-label="Close delete confirmation">
                <X size={18} />
              </button>
            </div>
            {deleteError && <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{deleteError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPendingDelete(null)} className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted hover:bg-surface hover:text-text">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={deleting} className="flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-bg disabled:opacity-55">
                <Trash2 size={15} /> {deleting ? "Deleting..." : "Delete record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
