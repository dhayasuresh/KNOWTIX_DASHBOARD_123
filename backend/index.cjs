const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ✅ Dynamic Analyzer
function analyzeContent(text) {
  const sentences = text
    .split(/[\.\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const keywords = [
    ...new Set(
      sentences
        .flatMap((s) => s.split(" "))
        .filter((w) => w.length > 4 && /^[A-Z]/.test(w))
    ),
  ].slice(0, 10);

  const study = keywords.map((k) => ({
    topic: k,
    definition:
      sentences.find((s) => s.toLowerCase().includes(k.toLowerCase())) ||
      `${k} is an important concept.`,
    example: `Example of ${k}: Applied in real-world scenario.`,
    formulas: [`Formula for ${k}: ...`, `Alternate form of ${k}`],
    scenario: `Scenario: ${k} in practice.`,
  }));

  const quiz = keywords.slice(0, 5).map((k, i) => ({
    question: `Which best describes ${k}?`,
    options: [
      `Definition of ${k}`,
      `Formula of ${k}`,
      `Example of ${k}`,
      `None of the above`,
    ],
    answer: `Definition of ${k}`,
    explanation: `${k} refers to ...`,
    marks: i % 2 === 0 ? 2 : 5,
  }));

  const sticky = keywords.map((k) => `⚡ Remember: Key fact about ${k}`);
  const importantTop = keywords.map((k, i) => ({
    question: `Explain ${k} in detail.`,
    answer: `Detailed explanation of ${k}.`,
    marks: i % 2 === 0 ? 5 : 10,
  }));

  return { topics: keywords, study, quiz, sticky, importantTop };
}

// ✅ Extractor (PDF/DOCX/TXT)
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".docx") {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }

  // Fallback: treat as plain text
  return fs.readFileSync(filePath, "utf-8");
}

// ✅ Upload + Analyze endpoint
app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    const text = await extractText(req.file.path);
    const analysis = analyzeContent(text);
    res.json({ analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("✅ Backend is running. Use /api/analyze to POST a file.");
});

// --- START SERVER ---
const PORT = 5002;
app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
