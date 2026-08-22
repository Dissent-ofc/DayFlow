import { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Plus, Search, ShieldCheck, X, Building2, UploadCloud, Check } from "lucide-react";
import { certificationPresets, skillPresets } from "../data/profilePresets";
import { useAuth } from "../context/AuthContext";

function initials(firstName, lastName) {
  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase();
}

function Picker({ title, items, selected, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const available = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => !selected.includes(item) && item.toLowerCase().includes(normalized));
  }, [items, query, selected]);

  return (
    <section className="admin-section rounded-xl border border-border bg-surface/65 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
          <p className="mt-1 text-xs text-muted">Add from the company-wide preset library.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-accent/60 bg-accent/15 px-3 py-2 text-xs font-semibold text-text transition hover:bg-accent/25"
        >
          <Plus size={14} /> Add {title}
        </button>
      </div>

      <div className="flex min-h-10 flex-wrap gap-2">
        {selected.map((item) => (
          <span key={item} className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs text-text">
            {item}
            <button type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item}`} className="text-muted hover:text-text"><X size={13} /></button>
          </span>
        ))}
        {selected.length === 0 && <span className="text-sm text-faint">Nothing added yet</span>}
      </div>

      {open && (
        <div className="mt-4 rounded-lg border border-border bg-surface-raised p-3">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full rounded-md border border-border bg-bg/70 py-2 pl-9 pr-3 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
            />
          </div>
          <div className="mt-3 grid max-h-44 gap-1 overflow-y-auto sm:grid-cols-2">
            {available.map((item) => (
              <button key={item} type="button" onClick={() => onAdd(item)} className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-muted hover:bg-border-soft hover:text-text">
                <Plus size={13} className="text-accent-2" /> {item}
              </button>
            ))}
            {available.length === 0 && <p className="px-3 py-2 text-xs text-faint">No matching presets.</p>}
          </div>
        </div>
      )}
    </section>
  );
}

export default function AdminProfile() {
  const { user, updateCompanyLogo } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [skills, setSkills] = useState(user?.skills?.length ? user.skills : ["Leadership", "People Operations", "Strategic Planning"]);
  const [certifications, setCertifications] = useState(user?.certifications?.length ? user.certifications : ["SHRM Certified Professional", "PMP"]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoSuccess, setLogoSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const role = user?.role ?? "EMPLOYEE";
  const roleLabel = role === "ADMIN" ? "Administrator" : role === "HR" ? "HR Officer" : "Employee";
  const accessLabel = role === "ADMIN" ? "Admin access" : role === "HR" ? "Full HR access" : "Employee access";
  const userName = user ? `${user.firstName} ${user.lastName}` : "Administrator";
  const userInitials = user ? initials(user.firstName, user.lastName) : "AD";
  const companyName = user?.company?.name || "DayFlow HQ";
  const companyLogo = user?.company?.logoUrl;
  const canEditCompany = role === "ADMIN" || role === "HR";

  function addItem(setter, item) {
    setter((current) => current.includes(item) ? current : [...current, item]);
  }

  function removeItem(setter, item) {
    setter((current) => current.filter((value) => value !== item));
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setLogoSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/png", 0.9);

        try {
          await updateCompanyLogo(dataUrl);
          setLogoSuccess(true);
          setTimeout(() => setLogoSuccess(false), 3000);
        } catch (err) {
          console.error("Failed to update logo", err);
        } finally {
          setUploadingLogo(false);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">{roleLabel} profile</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text">{roleLabel} profile</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Manage your HR identity, secure access credentials, and the expertise you bring to every employee record.</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-2 text-xs text-success"><ShieldCheck size={14} /> {roleLabel}</span>
      </div>

      <section className="admin-hero rounded-xl border border-border bg-surface/70 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent/60 bg-gradient-to-br from-accent/40 to-accent-2/30 font-display text-2xl font-semibold text-text shadow-[0_10px_30px_rgba(178,75,232,0.25)]">{userInitials}</div>
          <div className="min-w-[220px] flex-1">
            <p className="text-xs uppercase tracking-widest text-faint">Full name</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-text">{userName}</h2>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-muted">
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-5 w-5 rounded object-contain border border-border bg-surface-raised"
                />
              )}
              <span>{roleLabel} · {companyName}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><p className="text-xs text-faint">Login ID</p><p className="mt-1 font-mono text-text">{user?.loginId ?? "—"}</p></div>
            <div><p className="text-xs text-faint">Last active</p><p className="mt-1 text-text">{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Not available"}</p></div>
            <div><p className="text-xs text-faint">Access level</p><p className="mt-1 text-accent-2">{accessLabel}</p></div>
            <div><p className="text-xs text-faint">Email</p><p className="mt-1 text-text">{user?.email ?? "—"}</p></div>
          </div>
        </div>
      </section>

      {canEditCompany && (
        <section className="rounded-xl border border-border bg-surface/65 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent-2/15 p-2.5 text-accent-2">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-text">Company Branding</h2>
                <p className="text-xs text-muted">Your organization's official logo displayed to all employees on login and portal navigation.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
                aria-label="Upload new company logo"
              />

              <div className="flex items-center gap-3">
                {companyLogo ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface-raised p-1 shadow-sm">
                    <img src={companyLogo} alt={companyName} className="h-full w-full object-contain rounded" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-faint text-xs">
                    No logo
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3.5 py-2 text-xs font-semibold text-text transition hover:bg-accent/25 disabled:opacity-50"
                >
                  <UploadCloud size={15} />
                  {uploadingLogo ? "Saving…" : companyLogo ? "Change Logo" : "Upload Logo"}
                </button>
              </div>

              {logoSuccess && (
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <Check size={14} /> Updated
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-border bg-surface/65 p-5">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-lg bg-accent/15 p-2 text-accent-2"><KeyRound size={17} /></div><div><h2 className="font-display text-lg font-semibold text-text">Credentials & contact</h2><p className="text-xs text-muted">Keep your administrator record current.</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-muted">Work email<input value={user?.email ?? "—"} readOnly className="admin-input mt-2" /></label>
            <label className="text-xs text-muted">Login ID<input value={user?.loginId ?? "—"} readOnly className="admin-input mt-2 font-mono" /></label>
            <label className="text-xs text-muted">Password<input type={showPassword ? "text" : "password"} value="••••••••••••" readOnly className="admin-input mt-2 pr-10 font-mono" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="relative float-right -mt-8 mr-3 text-muted hover:text-text" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></label>
            <label className="text-xs text-muted">Role<input value={user?.role ?? "ADMIN"} readOnly className="admin-input mt-2 font-mono" /></label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-faint">Credentials are visible only to you and authorized administrators.</p>
            <Link to="/change-password" className="text-xs font-semibold text-accent-2 hover:text-text">Change password</Link>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface/65 p-5">
          <h2 className="font-display text-lg font-semibold text-text">Admin description</h2>
          <p className="mt-3 text-sm leading-6 text-muted">I help teams do their best work by keeping people operations clear, fair, and human. I oversee onboarding, attendance, development, and employee support across every department.</p>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg border border-border-soft bg-bg/30 p-3"><p className="font-display text-xl text-text">9</p><p className="mt-1 text-xs text-faint">Teams supported</p></div><div className="rounded-lg border border-border-soft bg-bg/30 p-3"><p className="font-display text-xl text-text">126</p><p className="mt-1 text-xs text-faint">Active employees</p></div></div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Picker title="Skills" items={skillPresets} selected={skills} onAdd={(item) => addItem(setSkills, item)} onRemove={(item) => removeItem(setSkills, item)} />
        <Picker title="Certifications" items={certificationPresets} selected={certifications} onAdd={(item) => addItem(setCertifications, item)} onRemove={(item) => removeItem(setCertifications, item)} />
      </div>
    </div>
  );
}