import express from "express";
import { cohere } from "../config/cohere.js";
import { safeJSONParse } from "../utils/jsonHelper.js";

const router = express.Router();

// Generate Questions
router.post("/generate-questions", async (req, res, next) => {
  try {
    const { subject, difficulty, numQuestions = 5 } = req.body;
    if (!subject || !difficulty) {
      return res.status(400).json({ error: "Missing subject or difficulty" });
    }

    const prompt = `Generate ${numQuestions} MCQs in ${subject} (${difficulty} difficulty). Return JSON array with:
{
  "question": "...",
  "options": ["A","B","C","D"],
  "answer": "A",
  "explanation": "..."
}`;

    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.generations?.[0]?.message?.content?.trim() || "[]";
    const questions = safeJSONParse(text);
    res.json({ questions });
  } catch (err) {
    next(err);
  }
});

// Generate Content
router.post("/generate-content", async (req, res, next) => {
  try {
    const { topic, type } = req.body;
    if (!topic || !type) return res.status(400).json({ error: "Missing inputs" });

    const prompts = {
      Quiz: `Generate 5 MCQs for "${topic}" (options A-D, answer + explanation).`,
      "Important Questions": `Generate 5 MCQs for "${topic}" (options A-D, answer + explanation).`,
      Summary: `Generate a concise bullet summary for "${topic}".`,
      Notes: `Generate structured notes with bullet points for "${topic}".`,
      "Study Materials": `Generate study material with numbering, definitions, and examples for "${topic}".`,
    };

    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [{ role: "user", content: prompts[type] || `Explain "${topic}"` }],
    });

    res.json({ content: response.generations?.[0]?.message?.content?.trim() || "" });
  } catch (err) {
    next(err);
  }
});

// Study Materials
router.post("/study-materials", async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });

    const prompt = `Analyze this text and return JSON with: topics, summary, importantPoints, definitions, formulas, quiz.\n\n${text}`;

    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.generations?.[0]?.message?.content?.trim() || "{}";
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(raw);
    } catch {
      aiAnalysis = { rawAIText: raw };
    }

    res.json(aiAnalysis);
  } catch (err) {
    next(err);
  }
});

export default router;
