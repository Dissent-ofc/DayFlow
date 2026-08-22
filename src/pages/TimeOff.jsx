import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Check, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const leaveTypes = [
  { value: "PAID", label: "Paid time off", allowance: 24, className: "bg-accent/70" },
  { value: "SICK", label: "Sick time off", allowance: 7, className: "bg-danger/80" },
  { value: "UNPAID", label: "Unpaid leave", allowance: null, className: "bg-muted" },
];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function statusLabel(status) {
  return status === "APPROVED" ? "Approved" : status === "REJECTED" ? "Rejected" : "Pending";
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  return Math.floor((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000) + 1;
}

function MiniMonth({ month, requests }) {
  const first = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1));
  const start = new Date(first);
  start.setUTCDate(1 - first.getUTCDay());
  const days = Array.from({ length: 42 }, (_, index) => new Date(start.getTime() + index * 86400000));
  function requestForDay(day) {
    const key = dayKey(day);
    return requests.find((request) => request.status !== "REJECTED" && key >= request.startDate && key <= request.endDate);
  }
  return (
    <div className="rounded-lg border border-border bg-surface/45 p-3">
      <h3 className="font-display text-sm font-semibold text-text">{monthNames[month.getUTCMonth()]} {month.getUTCFullYear()}</h3>
      <div className="mt-2 grid grid-cols-7 text-center font-mono text-[8px] uppercase text-faint">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-[10px]">
        {days.map((day) => {
          const request = requestForDay(day);
          const inMonth = day.getUTCMonth() === month.getUTCMonth();
          const type = leaveTypes.find((item) => item.value === request?.type);
          return <span key={dayKey(day)} className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full ${inMonth ? "text-muted" : "text-faint/40"} ${type?.className ?? ""}`} title={request ? `${type?.label} (${statusLabel(request.status).toLowerCase()})` : undefined}>{day.getUTCDate()}</span>;
        })}
      </div>
    </div>
  );
}

export default function TimeOff() {
  const { user } = useAuth();
  return user?.role === "ADMIN" || user?.role === "HR" ? <AdminTimeOff /> : <EmployeeTimeOff />;
}

function AdminTimeOff() {
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  function loadRequests() {
    setLoading(true);
    api.timeOffRequests().then(setRequests).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }

  useEffect(() => loadRequests(), []);

  async function review(id, status) {
    try {
      await api.reviewTimeOff(id, status);
      setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const filtered = requests.filter((request) => `${request.employeeName} ${request.employeeLoginId}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="space-y-6 pb-12">
      <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">Admin / HR view</p><h1 className="mt-2 font-display text-3xl font-semibold text-text">Time Off</h1><p className="mt-2 text-sm text-muted">Review leave requests for everyone in your company.</p></div>
      <section className="rounded-xl border border-border bg-surface/65 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-lg font-semibold text-text">Leave requests</h2><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees" className="admin-input w-full sm:max-w-64" /></div>
        {error && <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        {loading ? <div className="flex min-h-48 items-center justify-center text-sm text-muted">Loading leave requests...</div> : <div className="mt-5 overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[820px] border-collapse text-left"><thead className="bg-surface-raised"><tr>{["Employee", "Start date", "End date", "Time off type", "Status", "Actions"].map((heading) => <th key={heading} className="border-b border-border px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-faint">{heading}</th>)}</tr></thead><tbody>{filtered.map((request) => <tr key={request.id} onClick={() => setSelectedRequest(request)} className="cursor-pointer border-b border-border-soft last:border-0 hover:bg-surface"><td className="px-4 py-3"><p className="text-sm font-medium text-text">{request.employeeName}</p><p className="font-mono text-[10px] text-faint">{request.employeeLoginId}</p></td><td className="px-4 py-3 font-mono text-sm text-muted">{request.startDate}</td><td className="px-4 py-3 font-mono text-sm text-muted">{request.endDate}</td><td className="px-4 py-3 text-sm text-text">{leaveTypes.find((item) => item.value === request.type)?.label}</td><td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${request.status === "APPROVED" ? "border-success/35 bg-success/12 text-success" : request.status === "REJECTED" ? "border-danger/35 bg-danger/12 text-danger" : "border-accent-2/35 bg-accent-2/12 text-accent-2"}`}>{statusLabel(request.status)}</span></td><td className="px-4 py-3" onClick={(event) => event.stopPropagation()}><div className="flex gap-2">{request.status === "PENDING" ? <><button type="button" onClick={() => review(request.id, "APPROVED")} className="flex items-center gap-1 rounded-md bg-success/15 px-2.5 py-1.5 text-xs font-semibold text-success hover:bg-success/25"><Check size={13} /> Approve</button><button type="button" onClick={() => review(request.id, "REJECTED")} className="flex items-center gap-1 rounded-md bg-danger/15 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/25"><XCircle size={13} /> Reject</button></> : <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold ${request.status === "APPROVED" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>{request.status === "APPROVED" ? <Check size={13} /> : <XCircle size={13} />} {request.status === "APPROVED" ? "Approve" : "Reject"}</span>}</div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-sm text-muted">No leave requests found.</p>}</div>}
        {selectedRequest && <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/75 px-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl border border-border bg-surface-raised p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-wider text-accent-2">Leave request</p><h2 className="mt-2 font-display text-xl font-semibold text-text">{selectedRequest.employeeName}</h2><p className="mt-1 font-mono text-xs text-faint">{selectedRequest.employeeLoginId}</p></div><button type="button" onClick={() => setSelectedRequest(null)} className="rounded-md p-1 text-muted hover:bg-border-soft hover:text-text" aria-label="Close request"><X size={18} /></button></div><div className="mt-5 grid gap-3 text-sm"><p><span className="text-faint">Type</span><br /><strong className="text-text">{leaveTypes.find((item) => item.value === selectedRequest.type)?.label}</strong></p><p><span className="text-faint">Validity</span><br /><strong className="text-text">{selectedRequest.startDate} to {selectedRequest.endDate}</strong></p><p><span className="text-faint">Reason</span><br /><strong className="text-text">{selectedRequest.remarks || "No reason provided."}</strong></p></div><div className="mt-6 flex justify-end gap-3">{selectedRequest.status !== "APPROVED" && <button type="button" onClick={() => { review(selectedRequest.id, "APPROVED"); setSelectedRequest(null); }} className="flex items-center gap-1 rounded-md bg-success/15 px-3 py-2 text-xs font-semibold text-success"><Check size={13} /> Approve</button>}{selectedRequest.status !== "REJECTED" && <button type="button" onClick={() => { review(selectedRequest.id, "REJECTED"); setSelectedRequest(null); }} className="flex items-center gap-1 rounded-md bg-danger/15 px-3 py-2 text-xs font-semibold text-danger"><XCircle size={13} /> Reject</button>}</div></div></div>}
      </section>
    </div>
  );
}

function EmployeeTimeOff() {
  const [year, setYear] = useState(() => new Date().getUTCFullYear());
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("PAID");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function loadRequests() {
    setLoading(true);
    api.timeOff().then(setRequests).catch(() => setRequests([])).finally(() => setLoading(false));
  }

  useEffect(() => loadRequests(), []);

  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => new Date(Date.UTC(year, index, 1))), [year]);
  const approved = requests.filter((request) => request.status === "APPROVED");
  const usedPaid = approved.filter((request) => request.type === "PAID").reduce((total, request) => total + daysBetween(request.startDate, request.endDate), 0);
  const usedSick = approved.filter((request) => request.type === "SICK").reduce((total, request) => total + daysBetween(request.startDate, request.endDate), 0);

  async function submitRequest(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.requestTimeOff({ type, startDate, endDate, remarks });
      setShowForm(false);
      setStartDate("");
      setEndDate("");
      setRemarks("");
      loadRequests();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">Personal records</p><h1 className="mt-2 font-display text-3xl font-semibold text-text">Time Off</h1><p className="mt-2 text-sm text-muted">View your leave calendar and submit a request.</p></div>
        <button type="button" onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-bg"><Plus size={16} /> New request</button>
      </div>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface/65 p-5"><p className="font-display text-base text-text">Paid time off</p><p className="mt-2 font-display text-3xl text-accent">{Math.max(0, 24 - usedPaid)} <span className="text-sm text-muted">days available</span></p></div>
        <div className="rounded-xl border border-border bg-surface/65 p-5"><p className="font-display text-base text-text">Sick time off</p><p className="mt-2 font-display text-3xl text-danger">{Math.max(0, 7 - usedSick)} <span className="text-sm text-muted">days available</span></p></div>
      </section>
      <section className="rounded-xl border border-border bg-surface/65 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><CalendarDays size={18} className="text-accent-2" /><h2 className="font-display text-lg font-semibold text-text">My leave calendar</h2></div><div className="flex items-center gap-2"><button type="button" onClick={() => setYear((current) => current - 1)} className="rounded-md border border-border p-2 text-muted hover:border-accent hover:text-text" aria-label="Previous year"><ChevronLeft size={16} /></button><span className="min-w-12 text-center font-mono text-sm text-text">{year}</span><button type="button" onClick={() => setYear((current) => current + 1)} className="rounded-md border border-border p-2 text-muted hover:border-accent hover:text-text" aria-label="Next year"><ChevronRight size={16} /></button></div></div>
        {loading ? <div className="flex min-h-64 items-center justify-center text-sm text-muted">Loading your leave data...</div> : <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{months.map((month) => <MiniMonth key={month.getUTCMonth()} month={month} requests={requests} />)}</div>}
        <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-accent" /> Paid time off</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-danger" /> Sick leave</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-muted" /> Unpaid leave</span></div>
      </section>
      {requests.length > 0 && <section className="rounded-xl border border-border bg-surface/65 p-5"><h2 className="font-display text-lg font-semibold text-text">My requests</h2><div className="mt-4 space-y-2">{requests.map((request) => <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border-soft py-3 text-sm"><span className="text-text">{leaveTypes.find((item) => item.value === request.type)?.label}</span><span className="font-mono text-xs text-muted">{request.startDate} to {request.endDate}</span><span className={`text-xs ${request.status === "APPROVED" ? "text-success" : request.status === "REJECTED" ? "text-danger" : "text-accent-2"}`}>{statusLabel(request.status)}</span></div>)}</div></section>}
      {showForm && <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/75 px-4 backdrop-blur-sm"><form onSubmit={submitRequest} className="w-full max-w-md rounded-xl border border-border bg-surface-raised p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold text-text">Time Off Type Request</h2><button type="button" onClick={() => setShowForm(false)} className="rounded-md p-1 text-muted hover:bg-border-soft hover:text-text" aria-label="Close request"><X size={18} /></button></div><div className="mt-5 space-y-4"><label className="block text-sm text-muted">Time off type<select value={type} onChange={(event) => setType(event.target.value)} className="admin-input mt-2">{leaveTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm text-muted">Start date<input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="admin-input mt-2" /></label><label className="block text-sm text-muted">End date<input required type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="admin-input mt-2" /></label></div><label className="block text-sm text-muted">Reason<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} className="admin-input mt-2 min-h-24" placeholder="Add a short reason" /></label>{error && <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted">Discard</button><button type="submit" disabled={submitting} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg">{submitting ? "Submitting..." : "Submit"}</button></div></div></form></div>}
    </div>
  );
}
