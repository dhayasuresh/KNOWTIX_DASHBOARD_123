import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function test() {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS db");
    console.log("✅ Connected to database:", rows[0].db);
    await pool.end();
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}

test();
