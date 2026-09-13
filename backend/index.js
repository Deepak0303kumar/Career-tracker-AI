require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const resumeRoutes = require("./routes/resume");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/resume", resumeRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});