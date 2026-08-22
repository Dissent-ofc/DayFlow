import { useState } from "react";
import { ArrowLeft, Check, LockKeyhole, UserPlus } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function NewEmployee() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { id, loginId, tempPassword }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.createEmployee({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        department: department.trim() || undefined,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-success/30 bg-surface/70 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <Check size={22} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-text">Employee account created</h1>
        <p className="mt-2 text-sm text-muted">
          Share these credentials securely with {firstName} {lastName}.
        </p>
        <div className="mx-auto mt-6 grid max-w-md gap-3 text-left sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-bg/30 p-3">
            <p className="text-xs text-faint">Login ID</p>
            <p className="mt-1 font-mono text-text">{result.loginId}</p>
          </div>
          <div className="rounded-lg border border-border bg-bg/30 p-3">
            <p className="text-xs text-faint">Employee ID</p>
            <p className="mt-1 break-all font-mono text-text">{result.id}</p>
          </div>
          <div className="rounded-lg border border-border bg-bg/30 p-3 sm:col-span-2">
            <p className="text-xs text-faint">Temporary password</p>
            <p className="mt-1 font-mono text-text">{result.tempPassword}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/employees/${result.id}`)}
          className="mt-6 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg"
        >
          Open profile
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={15} /> Back to employees
      </button>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">Admin only</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-text">Add new employee</h1>
        <p className="mt-2 text-sm text-muted">
          Create an employee account. The system will auto-generate a Login ID and temporary password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface/70 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm text-muted">
            First name
            <input
              required
              minLength={2}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Sparsh"
              className="admin-input mt-2"
            />
          </label>
          <label className="text-sm text-muted">
            Last name
            <input
              required
              minLength={2}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Sharma"
              className="admin-input mt-2"
            />
          </label>
          <label className="text-sm text-muted">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@company.com"
              className="admin-input mt-2"
            />
          </label>
          <label className="text-sm text-muted">
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="admin-input mt-2"
            />
          </label>
          <label className="text-sm text-muted">
            Job title
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Product Designer"
              className="admin-input mt-2"
            />
          </label>
          <label className="text-sm text-muted">
            Department
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering"
              className="admin-input mt-2"
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <p className="mt-5 flex items-center gap-2 text-xs text-faint">
          <LockKeyhole size={13} /> Login ID and temporary password are auto-generated by the system.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-bg disabled:opacity-55"
        >
          <UserPlus size={16} /> {loading ? "Creating…" : "Create employee"}
        </button>
      </form>
    </div>
  );
}
