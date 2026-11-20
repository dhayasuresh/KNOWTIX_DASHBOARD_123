import express from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { CohereClient } from "cohere-ai";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Cohere setup
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const MODEL = "command-a-03-2025";

// ---------- Helpers ----------
async function extractText(filePath, mimetype) {
  if (mimetype === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    return (await pdfParse(buffer)).text;
  }
  if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return (await mammoth.extractRawText({ path: filePath })).value;
  }
  if (mimetype === "text/plain") {
    return fs.readFileSync(filePath, "utf8");
  }
  return "";
}

async function askCohere(prompt) {
  const response = await cohere.chat({ model: MODEL, message: prompt });
  return response.text.trim();
}

function safeJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\[([\s\S]*)\]/);
    return match ? JSON.parse(match[0]) : [{ question: raw }];
  }
}

// ---------- Upload Route ----------
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { contentType, detailLevel, difficulty, quizCount, marks } = req.body;
    const text = await extractText(req.file.path, req.file.mimetype);
    fs.unlinkSync(req.file.path); // cleanup

    let response = { filename: req.file.originalname, extractedPreview: text.slice(0, 400) + "..." };

    switch (contentType) {
      case "study":
        response.summary = await askCohere(
          detailLevel === "detailed"
            ? `Generate detailed study notes with examples, derivations, and scenarios:\n\n${text}`
            : `Generate simple study notes with definitions and examples:\n\n${text}`
        );
        response.keywords = (await askCohere(`Extract 10 keywords:\n\n${text}`))
          .split(/[,•\n]/)
          .map((k) => k.trim())
          .filter(Boolean);
        break;

      case "quiz":
        response.quiz = safeJSON(
          await askCohere(
            `Generate ${quizCount || 3} MCQs (${difficulty || "medium"} difficulty). Return JSON with question, options, answer. Text:\n\n${text}`
          )
        );
        break;

      case "questions":
        response.importantQuestions = await askCohere(
          `Generate 5 important exam-style questions (no answers) from this text:\n\n${text}`
        );
        break;

      case "paper":
        response.paper = await askCohere(
          `Generate a structured ${marks || 50}-mark mini question paper (Sections A, B, C). Text:\n\n${text}`
        );
        break;
    }

    res.json(response);
  } catch (err) {
    console.error("❌ Upload Error:", err.message);
    res.status(500).json({ error: "Failed to analyze file" });
  }
});

export default router;
