import express from "express";
import multer from "multer";
import fs from "fs/promises";
import fsSync from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import cors from "cors";
import Tesseract from "tesseract.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { convert } from "pdf-poppler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5003;
const TEMP_FOLDER = join(__dirname, "temp");
const upload = multer({ dest: "uploads/" });

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
if (!fsSync.existsSync(TEMP_FOLDER)) fsSync.mkdirSync(TEMP_FOLDER, { recursive: true });

// ---------- Extract Text ----------
async function extractText(filePath, originalName) {
  const ext = originalName.toLowerCase();
  if (ext.endsWith(".pdf")) {
    const buffer = await fs.readFile(filePath);
    let text = (await pdfParse(buffer)).text.trim();

    if (text.length < 100) {
      // OCR fallback
      const options = { format: "png", out_dir: TEMP_FOLDER, out_prefix: "page", dpi: 300 };
      await convert(filePath, options);
      const files = fsSync.readdirSync(TEMP_FOLDER).filter(f => f.endsWith(".png")).sort();
      text = "";
      for (const f of files) {
        const { data: { text: ocrText } } = await Tesseract.recognize(join(TEMP_FOLDER, f), "eng");
        text += ocrText + "\n";
        await fs.unlink(join(TEMP_FOLDER, f)).catch(() => {});
      }
    }
    return text;
  }

  if (ext.endsWith(".docx")) return (await mammoth.extractRawText({ path: filePath })).value || "";
  if (ext.endsWith(".txt")) return await fs.readFile(filePath, "utf8");
  return "";
}

// ---------- Clean Text ----------
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// ---------- Smart Study Material Generator ----------
function generateStudyMaterial(text) {
  const sentences = text.split(/[\.\n]/).map(s => s.trim()).filter(Boolean);

  // Summary: top sentences containing key terms
  const summary = sentences.filter(s => /data|definition|example|type|analysis/i.test(s)).slice(0,3).join(". ") + ".";

  // Notes: examples & explanations
  const notes = sentences.filter(s => /example|serve|type|application|illustrate/i.test(s)).slice(0,7);

  // Keywords: frequency-based
  const freqMap = {};
  text.replace(/\b\w{4,}\b/g, w => freqMap[w.toLowerCase()] = (freqMap[w.toLowerCase()]||0)+1);
  const keywords = Object.entries(freqMap).sort((a,b)=>b[1]-a[1]).slice(0,15).map(e=>e[0]);

  // Topics
  const topics = ["Definitions","Examples","Applications","Key Points","Practice","Summary","Analysis","Concepts","Exercises","Notes"];

  // Quiz: context-aware
  const quiz = sentences.filter(s=>s.length>20).slice(0,5).map((s,i)=>{
    if(/definition/i.test(s)) return { question: `Define: "${s.split(":")[0]}"`, answer: s };
    if(/example/i.test(s)) return { question: `Give an example of: "${s.split(":")[0]}"`, answer: s };
    return { question: `Explain: "${s}"`, answer: s };
  });

  // Important Questions
  const important_questions = sentences.filter(s=>s.length>15).slice(0,5).map((s,i)=>({
    question: s,
    marks: `${10-i} marks`,
    answer: s
  }));

  return { summary, notes, keywords, topics, quiz, important_questions };
}

// ---------- API ----------
app.post("/api/analyze", upload.single("file"), async (req,res)=>{
  let filePath;
  try {
    if(!req.file) return res.status(400).json({ error: "No file uploaded" });
    filePath = req.file.path;

    const rawText = await extractText(filePath, req.file.originalname);
    const cleaned = cleanText(rawText);
    const data = generateStudyMaterial(cleaned);

    res.json({ status:"success", data });
  } catch(err) {
    console.error(err);
    res.status(500).json({ status:"failed", error:err.message });
  } finally {
    if(filePath) await fs.unlink(filePath).catch(()=>{});
  }
});

app.get("/api/health",(req,res)=>res.json({ status:"ok", timestamp:new Date().toISOString() }));

app.listen(PORT,()=>console.log(`🚀 StudyMaterials backend running at http://localhost:${PORT}`));
