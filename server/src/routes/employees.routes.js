import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword, generateTempPassword } from "../utils/auth.js";
import { generateLoginId } from "../utils/loginId.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const employeesRouter = Router();

/** GET /employees — the dashboard directory. Any signed-in employee can view. */
employeesRouter.get("/", requireAuth, async (req, res) => {
  const employees = await prisma.employee.findMany({
    where: { companyId: req.user.companyId },
    select: {
      id: true,
      loginId: true,
      firstName: true,
      lastName: true,
      role: true,
      jobTitle: true,
      avatarUrl: true,
    },
    orderBy: { firstName: "asc" },
  });
  res.json(employees);
});

/** GET /employees/:id — view-only profile (Image 4's click-through). */
employeesRouter.get("/:id", requireAuth, async (req, res) => {
  const employee = await prisma.employee.findFirst({
    where: { id: req.params.id, companyId: req.user.companyId },
    select: {
      id: true,
      loginId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      jobTitle: true,
      department: true,
      manager: true,
      location: true,
      joinDate: true,
      // Salary is included only for the Admin viewer, or the employee viewing themself.
      salary: req.user.role === "ADMIN" || req.user.id === req.params.id,
    },
  });
  if (!employee) return res.status(404).json({ error: "Employee not found." });
  res.json(employee);
});

/**
 * POST /employees — Admin/HR onboards a new employee.
 * Auto-generates the Login ID + a temporary password, per the wireframe note:
 * "Normal user cannot register... password should be auto generated... they
 * can login and change the system generated password."
 */
employeesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { firstName, lastName, email, phone, role, jobTitle, department } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "firstName, lastName and email are required." });
  }

  const company = await prisma.company.findUnique({ where: { id: req.user.companyId } });
  const joinYear = new Date().getFullYear();

  const lastInYear = await prisma.employee.findFirst({
    where: { companyId: company.id, joinYear },
    orderBy: { serial: "desc" },
  });
  const serial = (lastInYear?.serial ?? 0) + 1;

  const loginId = generateLoginId({
    companyCode: company.code,
    firstName,
    lastName,
    joinYear,
    serial,
  });
  const tempPassword = generateTempPassword();

  const employee = await prisma.employee.create({
    data: {
      loginId,
      email,
      passwordHash: await hashPassword(tempPassword),
      firstName,
      lastName,
      phone,
      role: role === "ADMIN" ? "ADMIN" : "EMPLOYEE",
      jobTitle,
      department,
      companyId: company.id,
      joinYear,
      serial,
      mustChangePassword: true,
    },
  });

  // Temp password is returned once, here, so HR can hand it to the new hire.
  // It is never stored or retrievable again after this response.
  res.status(201).json({
    id: employee.id,
    loginId: employee.loginId,
    tempPassword,
  });
});
