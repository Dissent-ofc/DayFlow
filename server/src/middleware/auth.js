import { verifyToken } from "../utils/auth.js";

/** Reads the JWT from the httpOnly cookie and attaches req.user. */
export function requireAuth(req, res, next) {
  const token = req.cookies?.dayflow_token;
  if (!token) return res.status(401).json({ error: "Not signed in." });

  try {
    req.user = verifyToken(token); // { id, role, companyId }
    next();
  } catch {
    return res.status(401).json({ error: "Session expired — please sign in again." });
  }
}

/** Gates employee-management routes to Admin/HR only. Use after requireAuth. */
export function requireAdmin(req, res, next) {
  if (!['ADMIN', 'HR'].includes(req.user?.role)) {
    return res.status(403).json({ error: "Admins and HR officers only." });
  }
  next();
}
