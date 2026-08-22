import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { employeesRouter } from "./routes/employees.routes.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { timeoffRouter } from "./routes/timeoff.routes.js";
import { salaryRouter } from "./routes/salary.routes.js";

const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
];

const envOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [...defaultOrigins, ...envOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/+$/, "");
      try {
        const hostname = new URL(origin).hostname;
        if (
          allowedOrigins.includes(normalized) ||
          /^http:\/\/localhost:[0-9]+$/.test(origin) ||
          /^http:\/\/127\.0\.0\.1:[0-9]+$/.test(origin) ||
          hostname.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
      } catch {
        // Fallback for non-URL origins
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/employees", employeesRouter);
app.use("/attendance", attendanceRouter);
app.use("/timeoff", timeoffRouter);
app.use("/salary", salaryRouter);

// Central error handler — keeps stack traces out of API responses.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`DayFlow API listening on :${PORT}`));
