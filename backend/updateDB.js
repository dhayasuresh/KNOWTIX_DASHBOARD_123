import sqlite3 from "sqlite3";
import { open } from "sqlite";

(async () => {
  const db = await open({ filename: "./users.db", driver: sqlite3.Database });
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN email TEXT UNIQUE`);
    console.log("✅ 'email' column added");
  } catch (err) {
    if (err.message.includes("duplicate column name")) {
      console.log("ℹ️ 'email' column already exists");
    } else {
      console.error(err.message);
    }
  }
  await db.close();
})();
