import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/auth.js";

export const timeoffRouter = Router();

function dateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

timeoffRouter.get("/", requireAuth, async (req, res) => {
  const requests = await prisma.leaveRequest.findMany({
    where: { employeeId: req.user.id },
    orderBy: { startDate: "asc" },
    select: { id: true, type: true, startDate: true, endDate: true, remarks: true, status: true },
  });
  res.json(requests.map((request) => ({
    ...request,
    startDate: request.startDate.toISOString().slice(0, 10),
    endDate: request.endDate.toISOString().slice(0, 10),
  })));
});

timeoffRouter.post("/", requireAuth, async (req, res) => {
  const { type, startDate: rawStartDate, endDate: rawEndDate, remarks } = req.body;
  const startDate = dateOnly(rawStartDate);
  const endDate = dateOnly(rawEndDate);
  if (!startDate || !endDate || endDate < startDate || !["PAID", "SICK", "UNPAID"].includes(type)) {
    return res.status(400).json({ error: "Valid leave type and date range are required." });
  }
  const request = await prisma.leaveRequest.create({
    data: { employeeId: req.user.id, type, startDate, endDate, remarks: remarks?.trim() || null },
    select: { id: true, type: true, startDate: true, endDate: true, remarks: true, status: true },
  });
  res.status(201).json({ ...request, startDate: rawStartDate, endDate: rawEndDate });
});

timeoffRouter.get("/requests", requireAuth, requireAdmin, async (req, res) => {
  const requests = await prisma.leaveRequest.findMany({
    where: { employee: { companyId: req.user.companyId } },
    orderBy: [{ status: "asc" }, { startDate: "asc" }],
    select: {
      id: true, type: true, startDate: true, endDate: true, remarks: true, status: true,
      employee: { select: { firstName: true, lastName: true, loginId: true } },
    },
  });
  res.json(requests.map((request) => ({
    ...request,
    startDate: request.startDate.toISOString().slice(0, 10),
    endDate: request.endDate.toISOString().slice(0, 10),
    employeeName: `${request.employee.firstName} ${request.employee.lastName}`,
    employeeLoginId: request.employee.loginId,
    employee: undefined,
  })));
});

timeoffRouter.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { status, reviewNote } = req.body;
  if (!["APPROVED", "REJECTED"].includes(status)) return res.status(400).json({ error: "Status must be APPROVED or REJECTED." });
  const request = await prisma.leaveRequest.findFirst({ where: { id: req.params.id, employee: { companyId: req.user.companyId } } });
  if (!request) return res.status(404).json({ error: "Leave request not found." });
  const attendanceChanges = [];
  for (let date = new Date(request.startDate); date <= request.endDate; date.setUTCDate(date.getUTCDate() + 1)) {
    const day = new Date(date);
    if (status === "APPROVED") {
      attendanceChanges.push(prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: request.employeeId, date: day } },
        update: { status: "LEAVE", checkIn: null, checkOut: null, reason: request.remarks || "Approved leave" },
        create: { employeeId: request.employeeId, date: day, status: "LEAVE", reason: request.remarks || "Approved leave" },
      }));
    } else {
      attendanceChanges.push(prisma.attendance.deleteMany({ where: { employeeId: request.employeeId, date: day, status: "LEAVE", reason: request.remarks || "Approved leave" } }));
    }
  }
  const updated = await prisma.$transaction([
    prisma.leaveRequest.update({
      where: { id: request.id },
      data: { status, reviewedBy: req.user.id, reviewNote: reviewNote?.trim() || null },
      select: { id: true, status: true, reviewNote: true },
    }),
    ...attendanceChanges,
  ]).then(([leaveRequest]) => leaveRequest);
  res.json(updated);
});