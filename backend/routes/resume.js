const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const prisma = require("../config/prisma");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "resumes");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(["application/pdf", "text/plain"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error("Only PDF or plain text resumes are supported"));
    }
    cb(null, true);
  },
});

async function extractText(filePath, mimeType) {
  if (mimeType === "text/plain") {
    return fs.readFileSync(filePath, "utf-8");
  }
  const buffer = fs.readFileSync(filePath);
  const result = await pdfParse(buffer);
  return result.text;
}

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const parsedText = await extractText(req.file.path, req.file.mimetype);
    const fileUrl = `/uploads/resumes/${req.file.filename}`;

    const resume = await prisma.resume.create({
      data: { fileName: req.file.originalname, fileUrl, parsedText, userId },
    });

    return res.status(201).json({
      resumeId: resume.id,
      fileName: resume.fileName,
      fileUrl: resume.fileUrl,
      parsedText: resume.parsedText,
    });
  } catch (err) {
    console.error("Resume upload failed:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
});

router.get("/:resumeId", async (req, res) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.resumeId },
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    return res.json(resume);
  } catch (err) {
    console.error("Fetching resume failed:", err);
    return res.status(500).json({ error: "Failed to fetch resume" });
  }
});

module.exports = router;
