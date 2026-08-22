import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword, signToken, authCookieOptions } from "../utils/auth.js";
import { deriveCompanyCode, generateLoginId } from "../utils/loginId.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

/**
 * POST /auth/register-company
 * Creates the Company and its first Admin employee.
 * Matches the "Register company" tab on the Sign Up screen.
 */
authRouter.post("/register-company", async (req, res) => {
  const { companyName, name, email, phone, password, logoUrl } = req.body;

  if (!companyName || !name || !email || !password) {
    return res.status(400).json({ error: "companyName, name, email and password are required." });
  }

  const [firstName, ...rest] = name.trim().split(" ");
  const lastName = rest.join(" ") || firstName;
  const joinYear = new Date().getFullYear();
  const companyCode = deriveCompanyCode(companyName);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
          code: companyCode,
          logoUrl: logoUrl || null,
        },
      });

      const loginId = generateLoginId({ companyCode, firstName, lastName, joinYear, serial: 1 });
      const passwordHash = await hashPassword(password);

      const admin = await tx.employee.create({
        data: {
          loginId,
          email,
          passwordHash,
          firstName,
          lastName,
          phone,
          role: "ADMIN",
          companyId: company.id,
          joinYear,
          serial: 1,
          mustChangePassword: false, // they set their own password at registration
        },
      });

      return { company, admin };
    });

    const token = signToken({
      id: result.admin.id,
      role: result.admin.role,
      companyId: result.company.id,
    });
    res.cookie("dayflow_token", token, authCookieOptions);

    res.status(201).json({
      loginId: result.admin.loginId,
      company: result.company.name,
      logoUrl: result.company.logoUrl,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "That email or company is already registered." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not register company." });
  }
});

/**
 * POST /auth/login
 * Accepts either loginId or email in the same field, per the wireframe's
 * single "Login ID or email" input.
 */
authRouter.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: "identifier and password are required." });
  }

  try {
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { loginId: { equals: identifier.trim(), mode: "insensitive" } },
          { email: { equals: identifier.trim(), mode: "insensitive" } },
          { loginId: { contains: identifier.trim(), mode: "insensitive" } },
        ],
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            code: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!employee || !(await verifyPassword(password, employee.passwordHash))) {
      return res.status(401).json({ error: "Incorrect Login ID/email or password." });
    }

    const token = signToken({ id: employee.id, role: employee.role, companyId: employee.companyId });
    await prisma.employee.update({ where: { id: employee.id }, data: { lastLoginAt: new Date() } });
    res.cookie("dayflow_token", token, authCookieOptions);

    res.json({
      id: employee.id,
      loginId: employee.loginId,
      role: employee.role,
      mustChangePassword: employee.mustChangePassword,
      company: employee.company,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message || "Database connection error or login failed." });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("dayflow_token", authCookieOptions);
  res.json({ ok: true });
});

/** POST /auth/change-password — used both for voluntary changes and the forced first-login change. */
authRouter.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters." });
  }

  const employee = await prisma.employee.findUnique({ where: { id: req.user.id } });
  if (!(await verifyPassword(currentPassword, employee.passwordHash))) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  await prisma.employee.update({
    where: { id: employee.id },
    data: { passwordHash: await hashPassword(newPassword), mustChangePassword: false },
  });

  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const employee = await prisma.employee.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      loginId: true,
      firstName: true,
      lastName: true,
      role: true,
      email: true,
      avatarUrl: true,
      companyId: true,
      skills: true,
      certifications: true,
      resumeSummary: true,
      interests: true,
      lastLoginAt: true,
      company: {
        select: {
          id: true,
          name: true,
          code: true,
          logoUrl: true,
        },
      },
    },
  });
  res.json(employee);
});

/** PATCH /auth/company — Admin/HR can update company profile and logo. */
authRouter.patch("/company", requireAuth, async (req, res) => {
  if (req.user.role !== "ADMIN" && req.user.role !== "HR") {
    return res.status(403).json({ error: "Only admins and HR can update company details." });
  }

  const { name, logoUrl } = req.body;
  const updateData = {};
  if (name) updateData.name = name;
  if (logoUrl !== undefined) updateData.logoUrl = logoUrl;

  try {
    const updatedCompany = await prisma.company.update({
      where: { id: req.user.companyId },
      data: updateData,
    });
    res.json(updatedCompany);
  } catch (err) {
    console.error("Update company error:", err);
    res.status(500).json({ error: "Could not update company profile." });
  }
});
