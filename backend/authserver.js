// backend/authserver.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "supersecret";
const PORT = process.env.PORT || 5001;

// --- DB SETUP ---
const dbPromise = open({
  filename: "./users.db",
  driver: sqlite3.Database,
});

(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      grade TEXT,
      password TEXT,
      login_count INTEGER DEFAULT 0,
      last_login TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

// --- Middleware: Token Auth ---
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// --- Signup / Existing User Login ---
app.post("/api/signup", async (req, res, next) => {
  try {
    const { username, email, grade, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Username, email & password required" });

    const db = await dbPromise;
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);

    if (existingUser) {
      // Existing user: increment login_count & update last_login
      const timestamp = new Date().toISOString();
      await db.run(
        "UPDATE users SET login_count = login_count + 1, last_login = ? WHERE id = ?",
        [timestamp, existingUser.id]
      );

      const updatedUser = await db.get(
        "SELECT id, username, email, grade, login_count, last_login, created_at FROM users WHERE id = ?",
        [existingUser.id]
      );

      const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, SECRET, { expiresIn: "2h" });

      return res.json({ message: "User already exists. Logged in automatically.", token, user: updatedUser });
    }

    // New user signup
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (username, email, grade, password) VALUES (?, ?, ?, ?)",
      [username, email.toLowerCase(), grade || "N/A", hashed]
    );

    const newUser = await db.get(
      "SELECT id, username, email, grade, login_count, last_login, created_at FROM users WHERE id = ?",
      [result.lastID]
    );

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET, { expiresIn: "2h" });

    res.json({ message: "Signup successful. Please login.", token, user: newUser });
  } catch (err) {
    next(err);
  }
});

// --- Login ---
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    const db = await dbPromise;
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (!user) return res.status(400).json({ error: "User not found or invalid password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "User not found or invalid password" });

    const timestamp = new Date().toISOString();
    await db.run(
      "UPDATE users SET login_count = login_count + 1, last_login = ? WHERE id = ?",
      [timestamp, user.id]
    );

    const updatedUser = await db.get(
      "SELECT id, username, email, grade, login_count, last_login, created_at FROM users WHERE id = ?",
      [user.id]
    );

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "2h" });

    res.json({ message: "Login successful", token, user: updatedUser });
  } catch (err) {
    next(err);
  }
});

// --- Protected Profile ---
app.get("/api/profile", authMiddleware, async (req, res, next) => {
  try {
    const db = await dbPromise;
    const user = await db.get(
      "SELECT id, username, email, grade, login_count, last_login, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// --- Central Error Handler ---
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal server error" });
});

// --- Start Server ---
app.listen(PORT, () =>
  console.log(`✅ Auth server running at http://localhost:${PORT}`)
);
