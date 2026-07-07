import { pool } from "./coonection";
import fs from "fs/promises";

async function initDb() {
  const sql = await fs.readFile("sql/schemas.sql", "utf-8");

  await pool.query(sql);

  console.log("Database initialized successfully");
}

initDb().catch((err) => {
  console.log("Error initialized database: " + err);
});
