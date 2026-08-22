import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword, generateTempPassword } from "../utils/auth.js";
import { generateLoginId } from "../utils/loginId.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const employeesRouter = Router();

/** GET /employees — the dashboard directory. Any signed-in employee can view. */
employeesRouter.get("/", requireAuth, async (req, res) => {
  const employees = await prisma.employee.findMany({
    where: { companyId: req.user.companyId, role: "EMPLOYEE" },
    select: {
      id: true,
      loginId: true,
      firstName: true,
      lastName: true,
      role: true,
      jobTitle: true,
      avatarUrl: true,
      attendance: {
        orderBy: { date: "desc" },
        take: 1,
        select: { status: true },
      },
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
      // Salary is strictly limited to Admins, including when viewing their own profile.
      salary: req.user.role === "ADMIN",
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
  const { firstName, lastName, phone, role, jobTitle, department } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ error: "firstName and lastName are required." });
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
  const generatedEmail = `${firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, "")}${loginId.toLowerCase()}@dayflow.io`;
  const tempPassword = generateTempPassword();

  const employee = await prisma.employee.create({
    data: {
      loginId,
      email: generatedEmail,
      passwordHash: await hashPassword(tempPassword),
      firstName,
      lastName,
      phone,
      role: role === "ADMIN" && req.user.role === "ADMIN" ? "ADMIN" : role === "HR" ? "HR" : "EMPLOYEE",
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
    email: employee.email,
    tempPassword,
  });
});

/** DELETE /employees/:id — Admin/HR can remove an employee from their company. */
employeesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: "You cannot delete your own account." });
  }

  const employee = await prisma.employee.findFirst({
    where: { id: req.params.id, companyId: req.user.companyId },
    select: { id: true },
  });
  if (!employee) return res.status(404).json({ error: "Employee not found." });

  await prisma.$transaction([
    prisma.salaryStructure.deleteMany({ where: { employeeId: employee.id } }),
    prisma.attendance.deleteMany({ where: { employeeId: employee.id } }),
    prisma.leaveRequest.deleteMany({ where: { employeeId: employee.id } }),
    prisma.employee.delete({ where: { id: employee.id } }),
  ]);

  res.json({ ok: true });
});
