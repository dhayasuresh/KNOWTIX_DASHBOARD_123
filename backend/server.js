import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";
import { createRequire } from "module";

dotenv.config();
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// ---------------- APP SETUP ----------------
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: "uploads/" });

// ---------------- AI SETUP ----------------
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const MODEL = "command-a-03-2025";

// ✅ Helper: Ask Cohere safely
async function askCohere(prompt) {
  try {
    const response = await cohere.chat({ model: MODEL, message: prompt });
    return response.text.trim();
  } catch (err) {
    console.error("❌ Cohere API Error:", err.message);
    throw new Error("AI service unavailable. Try again later.");
  }
}

// ---------------- FILE EXTRACT ----------------
async function extractText(filePath, mimetype) {
  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else if (mimetype === "text/plain") {
    return fs.readFileSync(filePath, "utf8");
  } else {
    return "⚠ Unsupported file type. Only PDF, DOCX, TXT supported.";
  }
}

// ---------------- AI: Generate Questions ----------------
app.post("/api/ai/generate-questions", async (req, res) => {
  try {
    const { subject, difficulty = "medium", numQuestions = 5 } = req.body;
    if (!subject) return res.status(400).json({ error: "Missing subject" });

    const prompt = `
Generate ${numQuestions} multiple choice questions in ${subject} 
with ${difficulty} difficulty.
Each question must be a JSON object like this:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "answer": "A",
  "explanation": "Why this is correct"
}
Return only a JSON array, nothing else.
    `;

    const text = await askCohere(prompt);
    let questions = [];
    try {
      questions = JSON.parse(text);
    } catch {
      const match = text.match(/\[([\s\S]*)\]/);
      questions = match ? JSON.parse(match[0]) : [];
    }

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- AI: Generate Content ----------------
app.post("/api/ai/generate-content", async (req, res) => {
  try {
    const { topic, type } = req.body;
    if (!topic || !type)
      return res.status(400).json({ error: "Missing topic or type" });

    const prompts = {
      "Quiz": `Generate 5 MCQs for "${topic}" with options, answer, and explanation. Do NOT return JSON.`,
      "Important Questions": `Generate 5 important MCQs for "${topic}" with options, answer, and explanation. Do NOT return JSON.`,
      "Summary": `Summarize "${topic}" in concise bullet points with one example.`,
      "Notes": `Generate key notes for "${topic}" using bullet points. Highlight important terms.`,
      "Study Materials": `Generate structured study material for "${topic}" using headings, definitions, and examples.`,
    };

    const content = await askCohere(prompts[type] || `Explain "${topic}"`);
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- FILE UPLOAD + AI ANALYSIS ----------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractText(req.file.path, req.file.mimetype);
    fs.unlinkSync(req.file.path); // cleanup

    const summary = await askCohere(`Summarize this text:\n\n${text}`);
    const quiz = await askCohere(`Generate 3 quiz questions from this text:\n\n${text}`);
    const keywords = await askCohere(`Extract 10 keywords from this text:\n\n${text}`);

    res.json({
      filename: req.file.originalname,
      extractedPreview: text.slice(0, 500) + "...",
      summary,
      quiz,
      keywords,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- STORAGE: Folders & Files ----------------
let storage = { folders: [] };

app.get("/api/folders", (req, res) => res.json(storage.folders));

app.post("/api/folders", (req, res) => {
  const { name } = req.body;
  const newFolder = { id: Date.now(), name, files: [] };
  storage.folders.push(newFolder);
  res.json(newFolder);
});

app.post("/api/folders/:id/files", (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;
  const folder = storage.folders.find(f => f.id == id);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  const newFile = { id: Date.now(), name, content };
  folder.files.push(newFile);
  res.json(newFile);
});

app.put("/api/folders/:fid/files/:fid", (req, res) => {
  const { fid, id } = req.params;
  const { content } = req.body;
  const folder = storage.folders.find(f => f.id == fid);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  const file = folder.files.find(f => f.id == id);
  if (!file) return res.status(404).json({ error: "File not found" });

  file.content = content;
  res.json(file);
});

app.delete("/api/folders/:fid/files/:id", (req, res) => {
  const { fid, id } = req.params;
  const folder = storage.folders.find(f => f.id == fid);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  folder.files = folder.files.filter(f => f.id != id);
  res.json({ success: true });
});

// ---------------- REAL-TIME COLLAB ----------------
let groups = [];
let polls = [];
let messages = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.emit("groups", groups);
  socket.emit("polls", polls);

  socket.on("createGroup", (group) => {
    groups.push(group);
    messages[group.id] = [];
    io.emit("groups", groups);
  });

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    socket.emit("messageHistory", messages[groupId] || []);
  });

  socket.on("sendMessage", (msg) => {
    messages[msg.group] = messages[msg.group] || [];
    messages[msg.group].push(msg);
    io.to(msg.group).emit("message", msg);
  });

  socket.on("createPoll", (poll) => {
    poll.votes = {};
    polls.push(poll);
    io.to(poll.group).emit("polls", polls.filter(p => p.group === poll.group));
  });

  socket.on("votePoll", ({ pollId, userId, option }) => {
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
      poll.votes[userId] = option;
      io.to(poll.group).emit("polls", polls.filter(p => p.group === poll.group));
    }
  });

  socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
});



// ---------------- FRONTEND SERVE ----------------
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
);

// ---------------- START SERVER ----------------
const PORT = 5000;
server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

app.get("/", (req, res) => res.send("✅ Knowtix backend is running!"));
