import express from "express";

const router = express.Router();
let storage = { folders: [] };

router.get("/folders", (req, res) => res.json(storage.folders));

router.post("/folders", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Folder name required" });

  const folder = { id: Date.now(), name, files: [] };
  storage.folders.push(folder);
  res.json(folder);
});

router.post("/folders/:id/files", (req, res) => {
  const folder = storage.folders.find((f) => f.id == req.params.id);
  if (!folder) return res.status(404).json({ error: "Folder not found" });

  const { name, content } = req.body;
  if (!name || !content) return res.status(400).json({ error: "Invalid file" });

  const file = { id: Date.now(), name, content };
  folder.files.push(file);
  res.json(file);
});

export default router;
