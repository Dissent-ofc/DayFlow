import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plane, Search, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const monthFormatter = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const statusMeta = {
  PRESENT: { label: "Present", className: "border-success/35 bg-success/12 text-success" },
  LEAVE: { label: "On leave", className: "border-accent-2/35 bg-accent-2/12 text-accent-2" },
  ABSENT: { label: "Absent", className: "border-danger/35 bg-danger/12 text-danger" },
  HALF_DAY: { label: "Half day", className: "border-accent/35 bg-accent/12 text-accent-2" },
};

function keyForDate(date) {
  return date.toISOString().slice(0, 10);
}

function isWeekday(date) {
  return date.getDay() > 0 && date.getDay() < 6;
}

function formatAttendanceTime(value) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
}

function monthDays(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
}

function CalendarDay({ day, record, compact = false, showReason = false }) {
  const today = keyForDate(new Date());
  const key = keyForDate(day);
  const isFuture = key > today;
  const status = record?.status ?? (!isFuture && isWeekday(day) && key < today ? "ABSENT" : null);
  const meta = status ? statusMeta[status] : null;
  return (
    <div className={`${compact ? "min-h-12 p-1.5" : "min-h-28 p-2.5"} border-b border-r border-border-soft ${key === today ? "bg-accent/8" : "bg-surface/35"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`font-mono text-xs ${key === today ? "font-semibold text-accent-2" : "text-faint"}`}>{day.getDate()}</span>
        {!compact && key === today && <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-semibold text-accent-2">Today</span>}
      </div>
      {meta ? (
        <div className={`${compact ? "mt-1" : "mt-5"} inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${meta.className}`}>
          {status === "LEAVE" && <Plane size={11} />}{!compact && meta.label}
        </div>
      ) : <p className={`${compact ? "mt-1" : "mt-6"} text-[10px] text-faint`}>{isFuture || !isWeekday(day) ? "-" : "Not marked"}</p>}
      {!compact && record?.checkIn && <p className="mt-2 font-mono text-[10px] text-muted">In {formatAttendanceTime(record.checkIn)}</p>}
      {!compact && record?.checkOut && <p className="font-mono text-[10px] text-muted">Out {formatAttendanceTime(record.checkOut)}</p>}
      {!compact && showReason && record?.reason && <p className="mt-2 max-w-full truncate text-[10px] text-muted" title={record.reason}>{record.reason}</p>}
    </div>
  );
}

function CalendarGrid({ days, recordMap, compact = false, showReason = false }) {
  return <div className="grid grid-cols-7">{days.map((day) => <CalendarDay key={keyForDate(day)} day={day} record={recordMap.get(keyForDate(day))} compact={compact} showReason={showReason} />)}</div>;
}

function timeValue(value) {
  return value ? new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "-";
}

function duration(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "-";
  const minutes = Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 60000));
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function AttendanceList() {
  const [date, setDate] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const dateKey = keyForDate(date);

  useEffect(() => {
    setLoading(true);
    api.attendanceList(dateKey).then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
  }, [dateKey]);

  const filteredRows = rows.filter((row) => `${row.name} ${row.loginId}`.toLowerCase().includes(query.trim().toLowerCase()));
  function moveDate(amount) {
    setDate((current) => new Date(current.getFullYear(), current.getMonth(), current.getDate() + amount));
  }

  return (
    <div className="space-y-6 pb-12">
      <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">Admin / HR view</p><h1 className="mt-2 font-display text-3xl font-semibold text-text">Attendance</h1><p className="mt-2 text-sm text-muted">Daily attendance for every employee and authority.</p></div>
      <section className="rounded-xl border border-border bg-surface/65 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-lg font-semibold text-text">Attendance list</h2><div className="flex items-center gap-2"><button type="button" onClick={() => moveDate(-1)} className="rounded-md border border-border p-2 text-muted hover:border-accent hover:text-text" aria-label="Previous day"><ChevronLeft size={16} /></button><button type="button" onClick={() => setDate(new Date())} className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted hover:border-accent hover:text-text">Today</button><button type="button" onClick={() => moveDate(1)} className="rounded-md border border-border p-2 text-muted hover:border-accent hover:text-text" aria-label="Next day"><ChevronRight size={16} /></button></div></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="font-display text-base text-text">{date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p><label className="relative block w-full sm:w-64"><Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees" className="admin-input pl-9" /></label></div>
        {loading ? <div className="flex min-h-48 items-center justify-center text-sm text-muted">Loading attendance...</div> : <div className="mt-5 overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[820px] border-collapse text-left"><thead className="bg-surface-raised"><tr>{["Employee", "Status", "Check In", "Check Out", "Work Hours", "Extra Hours"].map((heading) => <th key={heading} className="border-b border-border px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-faint">{heading}</th>)}</tr></thead><tbody>{filteredRows.map((row) => { const record = row.attendance; const status = record?.status ?? "UNMARKED"; const statusInfo = statusMeta[status]; const hours = duration(record?.checkIn, record?.checkOut); const extra = hours === "-" ? "-" : Math.max(0, Number(hours.slice(0, 2)) - 8).toString().padStart(2, "0") + ":" + hours.slice(3); return <tr key={row.id} className="border-b border-border-soft last:border-0 hover:bg-surface"><td className="px-4 py-3"><p className="text-sm font-medium text-text">{row.name}</p><p className="font-mono text-[10px] text-faint">{row.loginId} · {row.role}</p></td><td className="px-4 py-3">{statusInfo ? <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusInfo.className}`}>{status === "LEAVE" && <Plane size={11} />}{statusInfo.label}</span> : <span className="text-xs text-faint">Not marked</span>}</td><td className="px-4 py-3 font-mono text-sm text-muted">{timeValue(record?.checkIn)}</td><td className="px-4 py-3 font-mono text-sm text-muted">{timeValue(record?.checkOut)}</td><td className="px-4 py-3 font-mono text-sm text-text">{hours}</td><td className="px-4 py-3 font-mono text-sm text-muted">{extra}</td></tr>; })}</tbody></table>{filteredRows.length === 0 && <p className="p-8 text-center text-sm text-muted">No attendance records match this search.</p>}</div>}
      </section>
    </div>
  );
}

function AttendanceCalendar() {
  const { user } = useAuth();
  const canViewOthers = user?.role === "ADMIN" || user?.role === "HR";
  const [period, setPeriod] = useState(() => new Date());
  const [view, setView] = useState("month");
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(user?.id ?? "");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canViewOthers) return;
    api.listEmployees().then((data) => {
      setEmployees(data);
      setEmployeeId((current) => current || data[0]?.id || "");
    }).catch(() => setEmployees([]));
  }, [canViewOthers]);

  const range = useMemo(() => {
    if (view === "week") {
      const start = new Date(period.getFullYear(), period.getMonth(), period.getDate() - period.getDay());
      return { start, end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6) };
    }
    return {
      start: new Date(period.getFullYear(), view === "year" ? 0 : period.getMonth(), 1),
      end: new Date(period.getFullYear(), view === "year" ? 12 : period.getMonth() + 1, 0),
    };
  }, [period, view]);

  useEffect(() => {
    if (!user || (canViewOthers && !employeeId)) return;
    setLoading(true);
    api.attendance({ employeeId: canViewOthers ? employeeId : user.id, from: keyForDate(range.start), to: keyForDate(range.end), view })
      .then(setRecords).catch(() => setRecords([])).finally(() => setLoading(false));
  }, [canViewOthers, employeeId, range, user, view]);

  const recordMap = useMemo(() => new Map(records.map((record) => [record.date, record])), [records]);
  const selectedEmployee = employees.find((employee) => employee.id === employeeId);
  const days = useMemo(() => view === "week" ? Array.from({ length: 7 }, (_, index) => new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate() + index)) : monthDays(period), [period, range, view]);
  const yearMonths = useMemo(() => Array.from({ length: 12 }, (_, index) => new Date(period.getFullYear(), index, 1)), [period]);
  const summaryDays = useMemo(() => {
    const length = Math.round((range.end - range.start) / 86400000) + 1;
    return Array.from({ length }, (_, index) => new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate() + index));
  }, [range]);
  const dayStatuses = useMemo(() => summaryDays.map((day) => {
    const key = keyForDate(day);
    return recordMap.get(key)?.status ?? (!isWeekday(day) || key >= keyForDate(new Date()) ? null : "ABSENT");
  }), [recordMap, summaryDays]);
  const presentCount = dayStatuses.filter((status) => status === "PRESENT").length;
  const leaveCount = dayStatuses.filter((status) => status === "LEAVE").length;
  const absentCount = dayStatuses.filter((status) => status === "ABSENT").length;

  function shiftPeriod(amount) {
    setPeriod((current) => view === "week"
      ? new Date(current.getFullYear(), current.getMonth(), current.getDate() + amount * 7)
      : new Date(current.getFullYear() + (view === "year" ? amount : 0), current.getMonth() + (view === "year" ? 0 : amount), 1));
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">Workday record</p><h1 className="mt-2 font-display text-3xl font-semibold text-text">Attendance</h1><p className="mt-2 text-sm text-muted">Review today and the complete attendance history.</p></div>
        {canViewOthers && <label className="flex min-w-56 items-center gap-2 text-sm text-muted"><UserRound size={15} /><select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} className="admin-input"><option value="">Select employee</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>)}</select></label>}
      </div>
      <section className="rounded-xl border border-border bg-surface/65 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><CalendarDays size={18} className="text-accent-2" /><div><h2 className="font-display text-lg font-semibold text-text">{canViewOthers ? (selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "Employee attendance") : `${user?.firstName} ${user?.lastName}`}</h2><p className="text-xs text-muted">{view === "year" ? period.getFullYear() : view === "week" ? `${dateFormatter.format(range.start)} - ${dateFormatter.format(range.end)}` : monthFormatter.format(period)}</p></div></div><div className="flex items-center gap-2"><div className="flex rounded-md border border-border bg-bg/30 p-1">{["week", "month", "year"].map((option) => <button key={option} type="button" onClick={() => setView(option)} className={`rounded px-2.5 py-1.5 text-xs font-semibold capitalize ${view === option ? "bg-accent text-bg" : "text-muted hover:text-text"}`}>{option}</button>)}</div><button type="button" onClick={() => shiftPeriod(-1)} className="rounded-md border border-border p-2 text-muted hover:border-accent hover:text-text" aria-label="Previous period"><ChevronLeft size={16} /></button><button type="button" onClick={() => setPeriod(new Date())} className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted hover:border-accent hover:text-text">Today</button><button type="button" onClick={() => shiftPeriod(1)} className="rounded-md border border-border p-2 text-muted hover:border-accent hover:text-text" aria-label="Next period"><ChevronRight size={16} /></button></div></div>
        <div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-lg border border-success/25 bg-success/8 p-3"><p className="font-display text-xl text-success">{presentCount}</p><p className="text-xs text-muted">Present</p></div><div className="rounded-lg border border-accent-2/25 bg-accent-2/8 p-3"><p className="font-display text-xl text-accent-2">{leaveCount}</p><p className="text-xs text-muted">On leave</p></div><div className="rounded-lg border border-danger/25 bg-danger/8 p-3"><p className="font-display text-xl text-danger">{absentCount}</p><p className="text-xs text-muted">Absent</p></div></div>
        {loading ? <div className="flex min-h-72 items-center justify-center text-sm text-muted">Loading attendance...</div> : view === "year" ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{yearMonths.map((yearMonth) => <div key={yearMonth.getMonth()} className="overflow-hidden rounded-lg border border-border"><h3 className="border-b border-border bg-surface-raised px-3 py-2 font-display text-sm font-semibold text-text">{monthFormatter.format(yearMonth)}</h3><CalendarGrid days={monthDays(yearMonth)} recordMap={recordMap} compact /></div>)}</div> : <div className="mt-5 overflow-hidden rounded-lg border border-border"><div className="grid grid-cols-7 border-b border-border bg-surface-raised">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day} className="p-2 text-center font-mono text-[10px] uppercase text-faint">{day}</span>)}</div><CalendarGrid days={days} recordMap={recordMap} showReason={view === "week"} /></div>}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted"><span className="text-success">● Present</span><span className="text-accent-2">✈ On leave</span><span className="text-danger">● Absent</span>{view === "week" && <span className="text-faint">Reasons shown for this week</span>}</div>
      </section>
    </div>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  return user?.role === "ADMIN" || user?.role === "HR" ? <AttendanceList /> : <AttendanceCalendar />;
}
