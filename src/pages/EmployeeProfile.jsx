import { useEffect, useState } from "react";
import { ArrowLeft, Eye, LockKeyhole, Pencil, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const tabs = ["Resume", "Private Info", "Salary Info", "Security"];

function initials(firstName, lastName) {
  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase();
}

function Field({ label, value }) {
  return (
    <div className="employee-profile__field">
      <span>{label}</span>
      <strong>{value ?? "Not provided"}</strong>
    </div>
  );
}

function DetailPanel({ tab, employee, isAdmin }) {
  if (tab === "Resume") {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface/65 p-5">
          <h2 className="font-display text-lg font-semibold text-text">About</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            A valued member of the DayFlow team, contributing thoughtful work and
            helping the organization move with clarity.
          </p>
          <h3 className="mt-6 font-display text-base font-semibold text-text">Professional summary</h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            This employee profile is maintained by HR. Resume notes and professional
            highlights will appear here as they are added.
          </p>
        </section>
        <section className="rounded-xl border border-border bg-surface/65 p-5">
          <h2 className="font-display text-lg font-semibold text-text">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs text-text">Collaboration</span>
            <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs text-text">Communication</span>
            <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs text-text">Problem solving</span>
          </div>
          <h2 className="mt-7 font-display text-lg font-semibold text-text">Certifications</h2>
          <p className="mt-4 text-sm text-muted">No certifications added.</p>
        </section>
      </div>
    );
  }

  if (tab === "Private Info") {
    return (
      <div className="grid gap-x-10 gap-y-1 rounded-xl border border-border bg-surface/65 p-5 sm:grid-cols-2">
        <Field label="Email" value={employee.email} />
        <Field label="Phone" value={employee.phone} />
        <Field label="Address" value={employee.address} />
        <Field label="Department" value={employee.department} />
        <Field label="Manager" value={employee.manager} />
        <Field label="Location" value={employee.location} />
        <Field label="Date of joining" value={employee.joinDate ? new Date(employee.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Not provided"} />
        <Field label="Login ID" value={employee.loginId} />
      </div>
    );
  }

  if (tab === "Salary Info") {
    if (!isAdmin) {
      return (
        <div className="rounded-xl border border-border bg-surface/65 p-5">
          <div className="flex items-start gap-3 rounded-lg border border-accent-2/25 bg-accent-2/10 p-4">
            <LockKeyhole size={17} className="mt-0.5 shrink-0 text-accent-2" />
            <div>
              <h2 className="font-display text-base font-semibold text-text">Salary details are protected</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Compensation records are available to authorized HR administrators only.
                This employee view does not expose salary information.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-x-10 sm:grid-cols-2">
            <Field label="Pay cycle" value="Monthly" />
            <Field label="Currency" value="INR" />
            <Field label="Benefits" value="Company standard" />
            <Field label="Review cycle" value="Annual" />
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-xl border border-border bg-surface/65 p-5">
        <h2 className="font-display text-lg font-semibold text-text">Salary Structure</h2>
        <div className="mt-5 grid gap-x-10 sm:grid-cols-2">
          <Field label="Monthly wage" value={employee.salary ? `₹${employee.salary.monthlyWage?.toLocaleString("en-IN")}` : "Not set"} />
          <Field label="Pay cycle" value="Monthly" />
          <Field label="Currency" value="INR" />
          <Field label="Review cycle" value="Annual" />
        </div>
      </div>
    );
  }

  // Security tab
  return (
    <div className="grid gap-x-10 gap-y-1 rounded-xl border border-border bg-surface/65 p-5 sm:grid-cols-2">
      <div className="sm:col-span-2 mb-3 flex items-center gap-3 rounded-lg border border-success/25 bg-success/10 p-4 text-sm text-muted">
        <ShieldCheck size={17} className="text-success" /> Your login and security details are private and protected.
      </div>
      <Field label="Login ID" value={employee.loginId} />
      <Field label="Password" value="••••••••••••" />
      <Field label="Account status" value="Active" />
      <Field label="Two-factor authentication" value="Not configured" />
      <Field label="Last login" value="—" />
      <Field label="Recovery email" value={employee.email} />
    </div>
  );
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Resume");
  const [employee, setEmployee] = useState(null);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const isAdmin = user?.role === "ADMIN";
  const isSelf = user?.id === id;

  useEffect(() => {
    setLoadingEmployee(true);
    setFetchError("");
    api.getEmployee(id)
      .then(setEmployee)
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoadingEmployee(false));
  }, [id]);

  if (loadingEmployee) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="font-mono text-sm text-muted">Loading profile…</span>
      </div>
    );
  }

  if (fetchError || !employee) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted transition hover:text-text">
          <ArrowLeft size={15} /> Back to employees
        </button>
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-center">
          <p className="text-sm text-danger">{fetchError || "Employee not found."}</p>
        </div>
      </div>
    );
  }

  const employeeName = `${employee.firstName} ${employee.lastName}`;
  const canViewPrivateRecords = isAdmin || isSelf;
  const visibleTabs = canViewPrivateRecords ? tabs : ["Resume"];
  const selectedTab = visibleTabs.includes(activeTab) ? activeTab : "Resume";

  return (
    <div className="space-y-6 pb-12">
      <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted transition hover:text-text">
        <ArrowLeft size={15} /> Back to employees
      </button>

      <section className="rounded-xl border border-border bg-surface/70 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent-2/60 bg-accent-2/20 font-display text-2xl font-semibold text-text">
            {initials(employee.firstName, employee.lastName)}
          </div>
          <div className="min-w-[220px] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-text">{employeeName}</h1>
              <span className="flex items-center gap-1 rounded-full border border-border bg-bg/30 px-2 py-1 text-[11px] text-muted">
                <Eye size={12} /> View only
              </span>
              {isAdmin && (
                <span className="rounded-full border border-success/30 bg-success/10 px-2 py-1 text-[11px] text-success">
                  Admin full access
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{employee.jobTitle ?? "Team Member"} · {employee.department ?? "Operations"}</p>
            <div className="mt-2 flex flex-wrap gap-3 font-mono text-xs text-faint">
              <span>ID: {employee.id.slice(0, 8)}…</span>
              <span>Login: {employee.loginId}</span>
            </div>
          </div>
          <div className="grid min-w-[210px] gap-3 text-sm sm:grid-cols-2">
            <div><p className="text-xs text-faint">Role</p><p className="mt-1 capitalize text-text">{employee.role?.toLowerCase()}</p></div>
            <div><p className="text-xs text-faint">Department</p><p className="mt-1 text-text">{employee.department ?? "—"}</p></div>
            <div><p className="text-xs text-faint">Location</p><p className="mt-1 text-text">{employee.location ?? "—"}</p></div>
            <div><p className="text-xs text-faint">Email</p><p className="mt-1 text-text">{employee.email}</p></div>
          </div>
        </div>
      </section>

      {!canViewPrivateRecords && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-2/25 bg-accent-2/10 p-4 text-sm text-muted">
          <LockKeyhole size={16} className="text-accent-2" /> Only resume information is visible for another employee.
        </div>
      )}

      <nav className="flex flex-wrap gap-2 border-b border-border pb-2">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition ${
              selectedTab === tab ? "bg-accent text-bg" : "text-muted hover:bg-surface hover:text-text"
            }`}
          >
            {tab}
            {tab === "Security" && <LockKeyhole size={13} />}
          </button>
        ))}
      </nav>

      <DetailPanel tab={selectedTab} employee={employee} isAdmin={isAdmin} />

      <div className="flex items-center gap-2 text-xs text-faint">
        <Pencil size={13} /> Profile changes can only be made by an authorized administrator.
      </div>
    </div>
  );
}