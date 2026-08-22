import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRequired = location.state?.required;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmation) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-border bg-surface/70 p-6 sm:p-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 text-accent-2">
        <LockKeyhole size={21} />
      </div>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-accent-2">Account security</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-text">Change your password</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        {isRequired ? "Your administrator created this account with a temporary password. Set a private password to continue." : "Update the password for your DayFlow account."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm text-muted">Temporary/current password<input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="admin-input mt-2" autoComplete="current-password" /></label>
        <label className="block text-sm text-muted">New password<input required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="admin-input mt-2" autoComplete="new-password" /></label>
        <label className="block text-sm text-muted">Confirm new password<input required minLength={8} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="admin-input mt-2" autoComplete="new-password" /></label>
        {error && <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading || !user} className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-bg disabled:opacity-55">{loading ? "Updating..." : "Update password"}</button>
      </form>
    </div>
  );
}