require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

/* Middleware */
app.use(cors({
  origin: [
    "https://cvarticulator.vercel.app",
    "https://cvarticulator-*.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* DB */
connectDB();

/* Routes */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API is alive" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);


/* 🚨 THIS IS THE CRITICAL PART 🚨 */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
