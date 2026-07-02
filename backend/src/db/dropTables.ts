import { pool } from "./coonection";
import fs from "fs/promises";

async function dropTables() {
  const sql = await fs.readFile("sql/dropTables.sql", "utf-8");

  await pool.query(sql);

  console.log("Tables dropped successfully");
}

dropTables().catch((err) => {
  console.error("Error dropping database:", err);
});
