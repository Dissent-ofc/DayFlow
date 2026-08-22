import { useEffect, useState } from "react";
import { Calculator, LockKeyhole } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const money = (value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

function SalaryBreakdown({ item }) {
  const { employee, salary } = item;
  return (
    <section className="rounded-xl border border-border bg-surface/65 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-lg font-semibold text-text">{employee.name}</h2><p className="mt-1 font-mono text-xs text-faint">{employee.loginId} · {employee.role}</p></div><span className="rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">{salary.period}</span></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-border-soft bg-bg/30 p-3"><p className="text-xs text-faint">Gross salary</p><p className="mt-1 font-display text-xl text-text">{money(salary.gross)}</p></div><div className="rounded-lg border border-border-soft bg-bg/30 p-3"><p className="text-xs text-faint">Total deductions</p><p className="mt-1 font-display text-xl text-danger">{money(salary.totalDeductions)}</p></div><div className="rounded-lg border border-success/25 bg-success/8 p-3"><p className="text-xs text-faint">Net pay</p><p className="mt-1 font-display text-xl text-success">{money(salary.netPay)}</p></div></div>
      <div className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2"><div><p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-accent-2">Earnings</p>{Object.entries(salary.components).map(([key, value]) => <div key={key} className="flex justify-between border-b border-border-soft py-2 text-sm"><span className="text-muted">{key.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())}</span><strong className="text-text">{money(value)}</strong></div>)}</div><div><p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-accent-2">Contributions & adjustments</p>{Object.entries(salary.contributions).map(([key, value]) => <div key={key} className="flex justify-between border-b border-border-soft py-2 text-sm"><span className="text-muted">{key.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())}</span><strong className="text-text">{money(value)}</strong></div>)}</div></div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-faint"><span>Working days: {salary.workingDays}</span><span>Present: {salary.presentDays}</span><span>Leave: {salary.leaveDays}</span><span>Absent: {salary.absentDays}</span></div>
    </section>
  );
}

export default function Salary() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isHr = user?.role === "HR";
  useEffect(() => { if (isHr) api.companySalaries().then(setItems).finally(() => setLoading(false)); }, [isHr]);
  if (!isHr) return <Navigate to="/profile" replace />;
  return <div className="space-y-6 pb-12"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-2">HR payroll view</p><h1 className="mt-2 font-display text-3xl font-semibold text-text">Salary</h1><p className="mt-2 text-sm text-muted">Review calculated earnings, contributions, and attendance adjustments for every employee.</p></div><div className="flex items-center gap-2 rounded-lg border border-accent-2/25 bg-accent-2/10 p-4 text-sm text-muted"><LockKeyhole size={16} className="text-accent-2" /> Salary details are visible only to HR and the employee they belong to.</div>{loading ? <div className="flex min-h-48 items-center justify-center text-sm text-muted">Calculating salaries...</div> : <div className="space-y-4">{items.map((item) => <SalaryBreakdown key={item.employee.id} item={item} />)}</div>}<div className="flex items-center gap-2 text-xs text-faint"><Calculator size={14} /> Calculations update from the selected month&apos;s attendance and approved leave.</div></div>;
}