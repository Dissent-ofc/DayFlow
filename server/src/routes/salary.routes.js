import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { calculateSalary } from "../utils/salary.js";

export const salaryRouter = Router();

async function salaryForEmployee(employee, year, month) {
  const from = new Date(Date.UTC(year, month - 1, 1));
  const to = new Date(Date.UTC(year, month, 0));
  const [attendance, leaveRequests] = await Promise.all([
    prisma.attendance.findMany({ where: { employeeId: employee.id, date: { gte: from, lte: to } }, select: { status: true } }),
    prisma.leaveRequest.findMany({ where: { employeeId: employee.id, status: "APPROVED", startDate: { lte: to }, endDate: { gte: from } }, select: { type: true, startDate: true, endDate: true } }),
  ]);
  return calculateSalary({ monthlyWage: employee.salary?.monthlyWage ?? 50000, attendance, leaveRequests, year, month });
}

salaryRouter.get("/me", requireAuth, async (req, res) => {
  const now = new Date();
  const employee = await prisma.employee.findUnique({ where: { id: req.user.id }, include: { salary: true } });
  res.json({ employee: { id: employee.id, name: `${employee.firstName} ${employee.lastName}`, loginId: employee.loginId }, salary: await salaryForEmployee(employee, now.getUTCFullYear(), now.getUTCMonth() + 1) });
});

salaryRouter.get("/company", requireAuth, requireAdmin, async (req, res) => {
  if (req.user.role !== "HR") return res.status(403).json({ error: "The HR salary page is restricted to HR officers." });
  const now = new Date();
  const employees = await prisma.employee.findMany({ where: { companyId: req.user.companyId }, orderBy: { firstName: "asc" }, include: { salary: true } });
  res.json(await Promise.all(employees.map(async (employee) => ({ employee: { id: employee.id, name: `${employee.firstName} ${employee.lastName}`, loginId: employee.loginId, role: employee.role }, salary: await salaryForEmployee(employee, now.getUTCFullYear(), now.getUTCMonth() + 1) }))));
});