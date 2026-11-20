import sqlite3 from "sqlite3";

// point to the DB file relative to THIS script's location
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("❌ Failed to open DB:", err.message);
  } else {
    console.log("✅ Connected to users.db");
  }
});

db.all("PRAGMA table_info(users)", [], (err, rows) => {
  if (err) throw err;
  console.log("📌 Users table structure:", rows);
});

db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) throw err;
  console.log("📌 Users data:", rows);
});
