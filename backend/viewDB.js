import sqlite3 from "sqlite3";
import { open } from "sqlite";
import Table from "cli-table3";
import chalk from "chalk";

// --- DB SETUP ---
const dbPromise = open({
  filename: "./users.db",
  driver: sqlite3.Database,
});

(async () => {
  const db = await dbPromise;

  const users = await db.all("SELECT * FROM users");

  // Format dates
  const formatDate = (dt) => {
    if (!dt) return "-";
    const d = new Date(dt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  };

  // Table with colored headers
  const table = new Table({
    head: [
      chalk.cyan.bold("ID"),
      chalk.cyan.bold("Username"),
      chalk.cyan.bold("Email"),
      chalk.cyan.bold("Login Count"),
      chalk.cyan.bold("Last Login"),
      chalk.cyan.bold("Created At"),
      chalk.cyan.bold("Updated At")
    ],
    colWidths: [5, 25, 25, 12, 22, 22, 22],
    style: { head: [], border: [] }, // remove default colors
    wordWrap: true
  });

  users.forEach(u => {
    table.push([
      chalk.yellow(u.id),
      chalk.green(u.username || "-"),
      u.email || "-",
      u.login_count > 5 ? chalk.red(u.login_count) : chalk.blue(u.login_count),
      formatDate(u.last_login),
      formatDate(u.created_at),
      formatDate(u.updated_at)
    ]);
  });

  console.log(chalk.magenta.bold("📌 Users Table:"));
  console.log(table.toString());
})();
