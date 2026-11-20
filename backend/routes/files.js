import express from "express";
import multer from "multer";
import fs from "fs";
import { extractText } from "../utils/fileParser.js";
import { cohere } from "../config/cohere.js";

const router = express.Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractText(req.file.path, req.file.mimetype);
    fs.unlinkSync(req.file.path);

    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [{ role: "user", content: `Extract key points & quiz from:\n\n${text}` }],
    });

    res.json({
      filename: req.file.originalname,
      extractedText: text.slice(0, 800) + "...",
      aiAnalysis: response.generations?.[0]?.message?.content?.trim() || "",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
