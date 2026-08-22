import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const attendanceRouter = Router();

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function getEmployeeForRequest(req, employeeId) {
  const requestedId = employeeId || req.user.id;
  if (requestedId !== req.user.id && !["ADMIN", "HR"].includes(req.user.role)) return null;
  return prisma.employee.findFirst({ where: { id: requestedId, companyId: req.user.companyId }, select: { id: true } });
}

attendanceRouter.get("/", requireAuth, async (req, res) => {
  const employee = await getEmployeeForRequest(req, req.query.employeeId);
  if (!employee) return res.status(403).json({ error: "You cannot view this attendance calendar." });

  const today = new Date();
  const from = parseDate(req.query.from) ?? new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const to = parseDate(req.query.to) ?? new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));
  const records = await prisma.attendance.findMany({
    where: { employeeId: employee.id, date: { gte: from, lte: to } },
    orderBy: { date: "asc" },
    select: { date: true, checkIn: true, checkOut: true, status: true, reason: req.query.view === "week" },
  });
  res.json(records.map((record) => ({ ...record, date: dateKey(record.date) })));
});

attendanceRouter.post("/check-in", requireAuth, async (req, res) => {
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const record = await prisma.attendance.upsert({
    where: { employeeId_date: { employeeId: req.user.id, date } },
    update: { checkIn: now, status: "PRESENT" },
    create: { employeeId: req.user.id, date, checkIn: now, status: "PRESENT" },
  });
  res.json({ ...record, date: dateKey(record.date) });
});

attendanceRouter.post("/check-out", requireAuth, async (req, res) => {
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const existing = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: req.user.id, date } } });
  if (!existing?.checkIn) return res.status(400).json({ error: "Check in before checking out." });
  const record = await prisma.attendance.update({ where: { id: existing.id }, data: { checkOut: now } });
  res.json({ ...record, date: dateKey(record.date) });
});

attendanceRouter.post("/mark", requireAuth, requireAdmin, async (req, res) => {
  const { employeeId, date: rawDate, status } = req.body;
  const date = parseDate(rawDate);
  if (!employeeId || !date || !["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"].includes(status)) {
    return res.status(400).json({ error: "employeeId, date and a valid status are required." });
  }
  const employee = await getEmployeeForRequest(req, employeeId);
  if (!employee) return res.status(404).json({ error: "Employee not found." });
  const record = await prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date } },
    update: { status },
    create: { employeeId, date, status },
  });
  res.json({ ...record, date: dateKey(record.date) });
});

attendanceRouter.get("/list", requireAuth, requireAdmin, async (req, res) => {
  const date = parseDate(req.query.date) ?? new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
  const employees = await prisma.employee.findMany({
    where: { companyId: req.user.companyId },
    orderBy: [{ role: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      loginId: true,
      firstName: true,
      lastName: true,
      role: true,
      attendance: { where: { date }, take: 1, select: { checkIn: true, checkOut: true, status: true } },
    },
  });
  res.json(employees.map((employee) => ({
    id: employee.id,
    loginId: employee.loginId,
    name: `${employee.firstName} ${employee.lastName}`,
    role: employee.role,
    attendance: employee.attendance[0] ?? null,
    date: dateKey(date),
  })));
});