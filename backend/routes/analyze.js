import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

const app = express();
const PORT = 5003;
app.use(cors());

const upload = multer({ dest: "uploads/" });

async function extractText(filePath, mimetype) {
  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else if (mimetype === "text/plain") {
    return fs.readFileSync(filePath, "utf8");
  } else {
    return "⚠ Unsupported file type. Only PDF, DOCX, TXT supported.";
  }
}

app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractText(req.file.path, req.file.mimetype);

    fs.unlinkSync(req.file.path);

    res.json({
      filename: req.file.originalname,
      sizeKB: Math.round(req.file.size / 1024),
      mimetype: req.file.mimetype,
      extractedPreview: text.substring(0, 500),
      fullText: text,
    });
  } catch (err) {
    console.error("File analysis failed:", err);
    res.status(500).json({ error: "Failed to analyze file" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ File analysis server running at http://localhost:${PORT}`);
});


// 1️⃣ File upload
//POST http://localhost:5003/analyze → returns fullText

// 2️⃣ AI analysis
//POST http://localhost:5003/cohere → body: { text: fullText } → returns { summary, quiz, keywords }
