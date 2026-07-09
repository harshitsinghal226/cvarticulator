require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

/* Security Headers */
app.use(helmet());

/* Rate Limiting */
const isProd = process.env.NODE_ENV === "production";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 100 : 10000, // relaxed limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 20 : 1000, // relaxed limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again later." },
});

app.use(generalLimiter);

/* CORS — only allow known origins */
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://cvarticulator.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    // Allow exact match or Vercel preview deployments
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/cvarticulator-[\w-]+\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* Body Parsing with size limits */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* Routes */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API is alive" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/resume", resumeRoutes);

/* 404 Catch-All */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* Global Error Handler */
app.use((err, req, res, _next) => {
  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Not allowed by CORS" });
  }

  console.error("Unhandled error:", err.stack || err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

/* Start server only after DB connection succeeds */
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database. Server not started.", err);
    process.exit(1);
  });

/* Graceful shutdown on unhandled errors */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
