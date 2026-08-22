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
  const { companyName, name, email, phone, password } = req.body;

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
        data: { name: companyName, code: companyCode },
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

  const employee = await prisma.employee.findFirst({
    where: { OR: [{ loginId: identifier }, { email: identifier }] },
  });

  if (!employee || !(await verifyPassword(password, employee.passwordHash))) {
    return res.status(401).json({ error: "Incorrect Login ID/email or password." });
  }

  const token = signToken({ id: employee.id, role: employee.role, companyId: employee.companyId });
  res.cookie("dayflow_token", token, authCookieOptions);

  res.json({
    id: employee.id,
    loginId: employee.loginId,
    role: employee.role,
    mustChangePassword: employee.mustChangePassword,
  });
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
    select: { id: true, loginId: true, firstName: true, lastName: true, role: true, email: true },
  });
  res.json(employee);
});
